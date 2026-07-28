import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, getStoredUser, type FeedVideo, type VideoComment, type VideoStatsTotals, type VideoDailyStat, type VideoTopVideo } from '../lib/api'
import { useLang, type Lang } from '../hooks/useLang'
import VideoUploadModal from '../components/VideoUploadModal'

const A = '#0d9488'

const t: Record<Lang, any> = {
  en: {
    forYou: 'For You',
    saved: 'Saved',
    mine: 'My Videos',
    empty: 'No videos yet',
    emptyHint: 'Be the first to share a moment from Sulawesi',
    emptySaved: 'You have not saved any videos yet',
    emptyMine: 'You have not posted any videos yet',
    upload: 'Upload',
    comments: 'Comments',
    noComments: 'No comments yet. Say something nice!',
    commentPlaceholder: 'Add a comment…',
    send: 'Send',
    visit: 'Visit place',
    deleteConfirm: 'Delete this video?',
    delete: 'Delete',
    back: 'Back',
    tapToPlay: 'Tap to play',
    analytics: 'Analytics',
    totalViews: 'Total Views',
    totalLikes: 'Total Likes',
    totalComments: 'Total Comments',
    totalShares: 'Total Shares',
    totalVideos: 'Videos',
    topVideos: 'Top Videos',
    last14Days: 'Last 14 days',
    noAnalytics: 'No analytics data yet',
  },
  id: {
    forYou: 'Untukmu',
    saved: 'Tersimpan',
    mine: 'Video Saya',
    empty: 'Belum ada video',
    emptyHint: 'Jadilah yang pertama membagikan momen dari Sulawesi',
    emptySaved: 'Kamu belum menyimpan video',
    emptyMine: 'Kamu belum mengunggah video',
    upload: 'Unggah',
    comments: 'Komentar',
    noComments: 'Belum ada komentar. Tulis sesuatu!',
    commentPlaceholder: 'Tambah komentar…',
    send: 'Kirim',
    visit: 'Lihat tempat',
    deleteConfirm: 'Hapus video ini?',
    delete: 'Hapus',
    back: 'Kembali',
    tapToPlay: 'Ketuk untuk memutar',
    analytics: 'Analitik',
    totalViews: 'Total Tayangan',
    totalLikes: 'Total Suka',
    totalComments: 'Total Komentar',
    totalShares: 'Total Bagikan',
    totalVideos: 'Video',
    topVideos: 'Video Teratas',
    last14Days: '14 hari terakhir',
    noAnalytics: 'Belum ada data analitik',
  },
}

function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`
  return String(n)
}

type Tab = 'foryou' | 'saved' | 'mine'

export default function VideoFeedPage() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const txt = t[lang]
  const currentUser = getStoredUser()

  const [tab, setTab] = useState<Tab>('foryou')
  const [videos, setVideos] = useState<FeedVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeId, setActiveId] = useState<number | null>(null)
  const [muted, setMuted] = useState(true)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [commentsFor, setCommentsFor] = useState<FeedVideo | null>(null)
  const [showAnalytics, setShowAnalytics] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map())
  const audioRef = useRef<HTMLAudioElement>(null)
  const countedViews = useRef<Set<number>>(new Set())

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.getVideos({ saved: tab === 'saved', mine: tab === 'mine' })
      setVideos(res.videos || [])
    } catch (err: any) {
      setError(err.message || 'Could not load videos')
      setVideos([])
    } finally {
      setLoading(false)
    }
  }, [tab])

  useEffect(() => { load() }, [load])

  // Autoplay whichever clip is centred in the viewport, pause the rest.
  useEffect(() => {
    const root = containerRef.current
    if (!root || videos.length === 0) return

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const id = Number((entry.target as HTMLElement).dataset.videoId)
        const el = videoRefs.current.get(id)
        if (!el) return

        if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
          setActiveId(id)
          el.play().catch(() => { /* autoplay blocked until user interacts */ })
          // Play background sound if the video has one
          const v = videos.find(vv => vv.id === id)
          if (audioRef.current) {
            if (v?.sound_url && !muted) {
              audioRef.current.src = v.sound_url
              audioRef.current.volume = 0.5
              audioRef.current.play().catch(() => {})
            } else {
              audioRef.current.pause()
            }
          }
          if (!countedViews.current.has(id)) {
            countedViews.current.add(id)
            api.countVideoView(id).catch(() => {})
          }
        } else {
          el.pause()
        }
      })
    }, { root, threshold: [0, 0.6, 1] })

    root.querySelectorAll('[data-video-id]').forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [videos, muted])

  // Scroll to a specific video by index
  const scrollToIndex = useCallback((idx: number) => {
    const root = containerRef.current
    if (!root || videos.length === 0) return
    const clamped = Math.max(0, Math.min(idx, videos.length - 1))
    const target = root.querySelector(`[data-video-id="${videos[clamped].id}"]`) as HTMLElement
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [videos])

  // Keyboard navigation for desktop
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (uploadOpen || commentsFor || showAnalytics) return
      const root = containerRef.current
      if (!root || videos.length === 0) return
      const idx = videos.findIndex(v => v.id === activeId)
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        scrollToIndex(idx + (e.key === 'ArrowDown' ? 1 : -1))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeId, videos, uploadOpen, commentsFor, showAnalytics, scrollToIndex])

  const patch = (id: number, changes: Partial<FeedVideo>) => {
    setVideos(prev => prev.map(v => (v.id === id ? { ...v, ...changes } : v)))
    setCommentsFor(prev => (prev && prev.id === id ? { ...prev, ...changes } : prev))
  }

  const handleLike = async (video: FeedVideo) => {
    // Optimistic flip, reconciled with the server response.
    patch(video.id, { liked: !video.liked, likes: video.likes + (video.liked ? -1 : 1) })
    try {
      const res = await api.toggleVideoLike(video.id)
      patch(video.id, { liked: res.liked, likes: res.likes })
    } catch {
      patch(video.id, { liked: video.liked, likes: video.likes })
    }
  }

  const handleSave = async (video: FeedVideo) => {
    patch(video.id, { is_saved: !video.is_saved })
    try {
      const res = await api.toggleVideoSave(video.id)
      patch(video.id, { is_saved: res.is_saved })
      if (tab === 'saved' && !res.is_saved) {
        setVideos(prev => prev.filter(v => v.id !== video.id))
      }
    } catch {
      patch(video.id, { is_saved: video.is_saved })
    }
  }

  const handleShare = async (video: FeedVideo) => {
    const url = `${window.location.origin}/reels?v=${video.id}`
    const shareData = { title: video.caption || 'GoSulawesi', text: video.caption || '', url }
    try {
      if (navigator.share) await navigator.share(shareData)
      else await navigator.clipboard.writeText(url)
      api.shareVideo(video.id).catch(() => {})
    } catch { /* user dismissed the share sheet */ }
  }

  const handleDelete = async (video: FeedVideo) => {
    if (!window.confirm(txt.deleteConfirm)) return
    try {
      await api.deleteVideo(video.id)
      setVideos(prev => prev.filter(v => v.id !== video.id))
    } catch (err: any) {
      setError(err.message || 'Could not delete video')
    }
  }

  const emptyText = tab === 'saved' ? txt.emptySaved : tab === 'mine' ? txt.emptyMine : txt.empty

  return (
    <div className="fixed inset-0 flex flex-col items-center" style={{ background: '#000' }}>

      {/* Phone-like container — full width on mobile, max 450px on desktop */}
      <div className="relative w-full h-full flex flex-col" style={{ maxWidth: 450 }}>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center gap-2 px-3 pt-3 pb-6"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)' }}>
        <button onClick={() => navigate('/tourist')}
          className="w-9 h-9 rounded-full flex items-center justify-center border-0 cursor-pointer flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }} aria-label={txt.back}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="flex-1 flex items-center justify-center gap-5">
          {([['foryou', txt.forYou], ['saved', txt.saved], ['mine', txt.mine]] as [Tab, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className="text-sm border-0 bg-transparent cursor-pointer pb-1 transition-all"
              style={{
                color: tab === key ? 'white' : 'rgba(255,255,255,0.6)',
                fontWeight: tab === key ? 800 : 500,
                borderBottom: tab === key ? '2px solid white' : '2px solid transparent',
              }}>
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {tab === 'mine' && (
            <button onClick={() => setShowAnalytics(true)}
              className="w-9 h-9 rounded-full flex items-center justify-center border-0 cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }} aria-label={txt.analytics}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </button>
          )}
          <button onClick={() => {
              setMuted(m => {
                const next = !m
                if (audioRef.current) {
                  if (next) audioRef.current.pause()
                  else if (activeId) {
                    const v = videos.find(vv => vv.id === activeId)
                    if (v?.sound_url) {
                      audioRef.current.src = v.sound_url
                      audioRef.current.volume = 0.5
                      audioRef.current.play().catch(() => {})
                    }
                  }
                }
                return next
              })
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center border-0 cursor-pointer flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
            {muted ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Feed */}
      <div ref={containerRef}
        className="flex-1 overflow-y-auto reel-scroll"
        style={{ scrollSnapType: 'y mandatory' }}>

        {loading && (
          <div className="h-full flex items-center justify-center">
            <div className="w-8 h-8 rounded-full animate-spin"
              style={{ border: '3px solid rgba(255,255,255,0.2)', borderTopColor: 'white' }} />
          </div>
        )}

        {!loading && videos.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-3 px-8 text-center">
            <span className="w-16 h-16 rounded-3xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
              </svg>
            </span>
            <p className="text-base font-bold text-white">{emptyText}</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{txt.emptyHint}</p>
            <button onClick={() => setUploadOpen(true)}
              className="mt-2 px-5 py-2.5 rounded-full text-sm font-bold border-0 cursor-pointer"
              style={{ background: A, color: 'white' }}>
              {txt.upload}
            </button>
          </div>
        )}

        {error && !loading && videos.length === 0 && (
          <p className="absolute bottom-24 left-0 right-0 text-center text-xs px-6" style={{ color: '#fca5a5' }}>{error}</p>
        )}

        {videos.map(video => (
          <div key={video.id} data-video-id={video.id}
            className="relative w-full h-full"
            style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}>

            <video
              ref={el => {
                if (el) videoRefs.current.set(video.id, el)
                else videoRefs.current.delete(video.id)
              }}
              src={video.video_url}
              poster={video.thumbnail_url || undefined}
              loop muted={muted} playsInline preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
              onClick={e => {
                const el = e.currentTarget
                if (el.paused) el.play().catch(() => {})
                else el.pause()
              }}
            />

            {/* Bottom gradient + meta */}
            <div className="absolute bottom-0 left-0 right-0 pt-16 pb-6 px-4 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
              <div className="pr-16 pointer-events-auto">
                <div className="flex items-center gap-2">
                  {video.user_avatar ? (
                    <img src={video.user_avatar} alt="" className="w-9 h-9 rounded-full object-cover" style={{ border: '2px solid white' }} />
                  ) : (
                    <span className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: A, border: '2px solid white' }}>
                      {video.user_name?.charAt(0) || 'T'}
                    </span>
                  )}
                  <p className="text-sm font-bold text-white">{video.user_name}</p>
                  {video.views > 0 && (
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>· {formatCount(video.views)} views</span>
                  )}
                </div>

                {video.caption && (
                  <p className="text-sm mt-2 leading-snug" style={{ color: 'rgba(255,255,255,0.95)' }}>{video.caption}</p>
                )}

                {(video.business_name || video.destination_name || video.city) && (
                  <button
                    onClick={() => {
                      if (video.business_id) navigate(`/business/${video.business_id}`)
                      else if (video.destination_id) navigate(`/destination/${video.destination_id}`)
                    }}
                    disabled={!video.business_id && !video.destination_id}
                    className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-0 cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.18)', color: 'white', backdropFilter: 'blur(6px)' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    {video.business_name || video.destination_name || video.city}
                  </button>
                )}

                {/* Sound attribution with spinning disc */}
                {video.sound_title && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full spin-disc flex items-center justify-center flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)', border: '2px solid rgba(255,255,255,0.3)' }}>
                      <span className="w-2 h-2 rounded-full" style={{ background: '#64748b' }} />
                    </span>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-white truncate">{video.sound_title}</p>
                      <p className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.6)' }}>{video.sound_artist}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action rail */}
            <div className="absolute right-3 bottom-24 flex flex-col items-center gap-4 z-20">
              <button onClick={() => handleLike(video)}
                className="flex flex-col items-center gap-1 border-0 bg-transparent cursor-pointer p-0">
                <span className="w-11 h-11 rounded-full flex items-center justify-center transition-transform active:scale-90"
                  style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24"
                    fill={video.liked ? '#f43f5e' : 'none'} stroke={video.liked ? '#f43f5e' : 'white'} strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </span>
                <span className="text-[11px] font-bold text-white">{formatCount(video.likes)}</span>
              </button>

              <button onClick={() => setCommentsFor(video)}
                className="flex flex-col items-center gap-1 border-0 bg-transparent cursor-pointer p-0">
                <span className="w-11 h-11 rounded-full flex items-center justify-center transition-transform active:scale-90"
                  style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </span>
                <span className="text-[11px] font-bold text-white">{formatCount(video.comments)}</span>
              </button>

              <button onClick={() => handleSave(video)}
                className="flex flex-col items-center gap-1 border-0 bg-transparent cursor-pointer p-0">
                <span className="w-11 h-11 rounded-full flex items-center justify-center transition-transform active:scale-90"
                  style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24"
                    fill={video.is_saved ? '#fbbf24' : 'none'} stroke={video.is_saved ? '#fbbf24' : 'white'} strokeWidth="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </span>
              </button>

              <button onClick={() => handleShare(video)}
                className="flex flex-col items-center gap-1 border-0 bg-transparent cursor-pointer p-0">
                <span className="w-11 h-11 rounded-full flex items-center justify-center transition-transform active:scale-90"
                  style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </span>
              </button>

              {currentUser?.id === video.user_id && (
                <button onClick={() => handleDelete(video)}
                  className="flex flex-col items-center gap-1 border-0 bg-transparent cursor-pointer p-0">
                  <span className="w-11 h-11 rounded-full flex items-center justify-center transition-transform active:scale-90"
                    style={{ background: 'rgba(239,68,68,0.25)', backdropFilter: 'blur(6px)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    </svg>
                  </span>
                </button>
              )}
            </div>

            {activeId === video.id && (
              <span className="sr-only">{txt.tapToPlay}</span>
            )}
          </div>
        ))}
      </div>

      {/* Upload button — bottom right glass pill */}
      <button onClick={() => setUploadOpen(true)}
        className="absolute right-4 bottom-6 z-30 flex items-center gap-2 px-4 py-2.5 rounded-full border-0 cursor-pointer text-sm font-bold transition-all active:scale-95"
        style={{
          background: 'rgba(255,255,255,0.1)',
          color: 'white',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.15)',
        }}>
        <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
        {txt.upload}
      </button>

      {/* Hidden audio element for background music */}
      <audio ref={audioRef} loop />

      <VideoUploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} onUploaded={load} />

      {commentsFor && (
        <CommentSheet
          video={commentsFor}
          txt={txt}
          onClose={() => setCommentsFor(null)}
          onCountChange={n => patch(commentsFor.id, { comments: n })}
        />
      )}

      {showAnalytics && (
        <AnalyticsSheet txt={txt} onClose={() => setShowAnalytics(false)} />
      )}
      </div>
    </div>
  )
}

function CommentSheet({ video, txt, onClose, onCountChange }: {
  video: FeedVideo
  txt: any
  onClose: () => void
  onCountChange: (n: number) => void
}) {
  const currentUser = getStoredUser()
  const [comments, setComments] = useState<VideoComment[]>([])
  const [loading, setLoading] = useState(true)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    api.getVideoComments(video.id)
      .then(res => setComments(res.comments || []))
      .catch(() => setComments([]))
      .finally(() => setLoading(false))
  }, [video.id])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || sending) return
    setSending(true)
    try {
      const res = await api.addVideoComment(video.id, text)
      setComments(prev => {
        const next = [res.comment, ...prev]
        onCountChange(next.length)
        return next
      })
      setInput('')
    } catch { /* keep the draft so the user can retry */ }
    finally { setSending(false) }
  }

  const handleDelete = async (id: number) => {
    try {
      await api.deleteVideoComment(video.id, id)
      setComments(prev => {
        const next = prev.filter(c => c.id !== id)
        onCountChange(next.length)
        return next
      })
    } catch { /* ignore */ }
  }

  return (
    <div className="fixed inset-0 z-[150] flex items-end" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="w-full rounded-t-3xl flex flex-col" style={{ background: 'white', maxHeight: '70vh' }}
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom: '1px solid #e5e7eb' }}>
          <p className="text-sm font-black" style={{ color: '#111827' }}>{txt.comments} · {comments.length}</p>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center border-0 bg-transparent cursor-pointer" style={{ color: '#6b7280' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3">
          {loading && <p className="text-xs text-center py-6" style={{ color: '#9ca3af' }}>…</p>}
          {!loading && comments.length === 0 && (
            <p className="text-xs text-center py-8" style={{ color: '#9ca3af' }}>{txt.noComments}</p>
          )}
          {comments.map(c => (
            <div key={c.id} className="flex items-start gap-2.5 py-2.5 group">
              {c.user_avatar ? (
                <img src={c.user_avatar} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
              ) : (
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: A }}>
                  {c.user_name?.charAt(0) || 'U'}
                </span>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold" style={{ color: '#111827' }}>{c.user_name}</p>
                <p className="text-sm mt-0.5 break-words" style={{ color: '#374151' }}>{c.comment_text}</p>
              </div>
              {currentUser?.id === c.user_id && (
                <button onClick={() => handleDelete(c.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity border-0 bg-transparent cursor-pointer p-1 flex-shrink-0"
                  style={{ color: '#ef4444' }} aria-label={txt.delete}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-5 py-3 flex-shrink-0" style={{ borderTop: '1px solid #e5e7eb' }}>
          <input value={input} onChange={e => setInput(e.target.value.slice(0, 500))}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder={txt.commentPlaceholder}
            className="flex-1 rounded-full px-4 py-2.5 text-sm outline-none"
            style={{ background: '#f3f4f6', color: '#111827' }} />
          <button onClick={handleSend} disabled={!input.trim() || sending}
            className="w-10 h-10 rounded-full flex items-center justify-center border-0 cursor-pointer flex-shrink-0"
            style={{ background: input.trim() ? A : '#d1d5db', color: 'white' }} aria-label={txt.send}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

function AnalyticsSheet({ txt, onClose }: {
  txt: any
  onClose: () => void
}) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<{
    aggregate: { total_videos: number; total_views: number; total_likes: number; total_comments: number; total_shares: number }
    top_videos: VideoTopVideo[]
    daily: VideoDailyStat[]
  } | null>(null)

  useEffect(() => {
    api.getMyVideoStats()
      .then((res: any) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  const statCards = data ? [
    { label: txt.totalVideos, value: data.aggregate.total_videos, color: '#0d9488', icon: 'M4 4h16v16H4z' },
    { label: txt.totalViews, value: data.aggregate.total_views, color: '#3b82f6', icon: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' },
    { label: txt.totalLikes, value: data.aggregate.total_likes, color: '#f43f5e', icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' },
    { label: txt.totalComments, value: data.aggregate.total_comments, color: '#8b5cf6', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
    { label: txt.totalShares, value: data.aggregate.total_shares, color: '#f97316', icon: 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z' },
  ] : []

  const maxDaily = data?.daily?.length ? Math.max(...data.daily.map(d => d.views + d.likes + d.comments), 1) : 1

  return (
    <div className="fixed inset-0 z-[150] flex items-end" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="w-full rounded-t-3xl flex flex-col" style={{ background: 'white', maxHeight: '85vh' }}
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom: '1px solid #e5e7eb' }}>
          <p className="text-sm font-black" style={{ color: '#111827' }}>{txt.analytics}</p>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center border-0 bg-transparent cursor-pointer" style={{ color: '#6b7280' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 rounded-full animate-spin" style={{ border: '3px solid #e5e7eb', borderTopColor: A }} />
            </div>
          )}

          {!loading && !data && (
            <p className="text-xs text-center py-12" style={{ color: '#9ca3af' }}>{txt.noAnalytics}</p>
          )}

          {!loading && data && (
            <>
              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-2.5 mb-5">
                {statCards.map((s, i) => (
                  <div key={i} className="rounded-2xl p-3" style={{ background: '#f9fafb', border: '1px solid #f3f4f6' }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-1.5" style={{ background: s.color }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d={s.icon} />
                      </svg>
                    </div>
                    <p className="text-lg font-black" style={{ color: '#111827' }}>{formatCount(s.value)}</p>
                    <p className="text-[10px] font-medium" style={{ color: '#9ca3af' }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Daily bar chart */}
              {data.daily.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-bold mb-2" style={{ color: '#6b7280' }}>{txt.last14Days}</p>
                  <div className="flex items-end gap-1 h-24 rounded-xl p-2" style={{ background: '#f9fafb' }}>
                    {data.daily.map((d, i) => {
                      const total = d.views + d.likes + d.comments
                      const h = Math.max((total / maxDaily) * 100, 3)
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center justify-end" style={{ height: '100%' }}>
                          <div style={{
                            height: `${h}%`,
                            background: 'linear-gradient(to top, #0d9488, #14b8a6)',
                            borderRadius: 3,
                            width: '100%',
                            minWidth: 4,
                          }} />
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Top videos */}
              {data.top_videos.length > 0 && (
                <div>
                  <p className="text-xs font-bold mb-2" style={{ color: '#6b7280' }}>{txt.topVideos}</p>
                  <div className="space-y-2">
                    {data.top_videos.map((v, i) => (
                      <div key={v.id} className="flex items-center gap-3 rounded-xl p-2.5" style={{ background: '#f9fafb' }}>
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                          style={{ background: i === 0 ? '#f59e0b' : i === 1 ? '#9ca3af' : i === 2 ? '#d97706' : '#e5e7eb', color: i < 3 ? 'white' : '#6b7280' }}>
                          {i + 1}
                        </span>
                        {v.thumbnail_url ? (
                          <img src={v.thumbnail_url} alt="" className="w-10 h-14 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-14 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#e5e7eb' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                              <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
                            </svg>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate" style={{ color: '#111827' }}>{v.caption || `Video #${v.id}`}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] flex items-center gap-0.5" style={{ color: '#6b7280' }}>
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                              {formatCount(v.views)}
                            </span>
                            <span className="text-[10px] flex items-center gap-0.5" style={{ color: '#6b7280' }}>
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                              {formatCount(v.likes)}
                            </span>
                            <span className="text-[10px] flex items-center gap-0.5" style={{ color: '#6b7280' }}>
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                              {formatCount(v.comments)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
