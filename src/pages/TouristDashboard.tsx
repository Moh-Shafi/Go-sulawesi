import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, getStoredUser } from '../lib/api'
import { useLang, type Lang } from '../hooks/useLang'
import { getSavedIds, toggleSavedId } from '../lib/saved'
import TouristLayout from '../components/TouristLayout'

const A = '#0d9488'
const AL = '#f0fdfa'
const BG = '#f5f6fa'
const TEXT = '#111827'
const MUTED = '#6b7280'
const SUBTLE = '#9ca3af'
const BORDER = '#e5e7eb'
const CARD = '#ffffff'
const shadow = '0 1px 4px rgba(0,0,0,0.07)'

const t: Record<Lang, any> = {
  en: {
    explore: 'Explore',
    discover: 'Discover',
    myTrips: 'My Trips',
    savedPlaces: 'Saved Places',
    bookings: 'Bookings',
    reviews: 'Reviews',
    following: 'Following',
    settings: 'Settings',
    setting: 'Setting',
    logout: 'Logout',
    searchPlaceholder: 'Search destinations, guides, experiences…',
    featuredToday: 'Featured Today',
    reviewsCount: 'reviews',
    bookNow: 'Book Now',
    all: 'All',
    nature: 'Nature',
    culture: 'Culture',
    adventure: 'Adventure',
    village: 'Village',
    coastal: 'Coastal',
    tripsTaken: 'Trips Taken',
    saved: 'Saved',
    total: 'total',
    bookmarked: 'bookmarked',
    given: 'given',
    available: 'available',
    toExplore: 'to explore',
    destinations: 'Destinations',
    trendTrips: 'trips',
    trendPlaces: 'places',
    personalizedForYou: 'Personalized for you',
    showingDestinationsFirst: 'Showing {style} destinations first',
    planTrip: 'Plan Trip',
    getPersonalized: 'Get personalized recommendations',
    takeQuizDesc: 'Take a 1-minute quiz to find your perfect match',
    takeQuiz: 'Take Quiz',
    exploreSulawesi: 'Explore Sulawesi',
    destinationsAvailable: '{count} destinations available',
    seeAll: 'See all →',
    perfectMatch: 'Perfect Match',
    match: 'Match',
    myBookings: 'My Bookings',
    totalBookings: '{count} total bookings',
    noBookings: 'No bookings yet. Start exploring!',
    status: 'Status',
    details: 'Details',
    explorer: 'Explorer',
    days: 'days',
    confirmed: 'Confirmed',
    thisWeek: 'This Week',
    youMightLove: 'You Might Love',
    seeAllPlain: 'See all',
    moreDestinations: 'More destinations coming soon!',
    styleLabels: { adventure: 'Adventure Seeker', culture: 'Culture Explorer', nature: 'Nature Lover', culinary: 'Food Enthusiast' },
    barLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    statusLabels: { confirmed: 'Confirmed', completed: 'Completed', pending: 'Pending', cancelled: 'Cancelled' },
  },
  id: {
    explore: 'Jelajahi',
    discover: 'Temukan',
    myTrips: 'Perjalanan Saya',
    savedPlaces: 'Tempat Tersimpan',
    bookings: 'Pemesanan',
    reviews: 'Ulasan',
    following: 'Diikuti',
    settings: 'Pengaturan',
    setting: 'Pengaturan',
    logout: 'Keluar',
    searchPlaceholder: 'Cari destinasi, pemandu, pengalaman…',
    featuredToday: 'Unggulan Hari Ini',
    reviewsCount: 'ulasan',
    bookNow: 'Pesan Sekarang',
    all: 'Semua',
    nature: 'Alam',
    culture: 'Budaya',
    adventure: 'Petualangan',
    village: 'Desa',
    coastal: 'Pantai',
    tripsTaken: 'Perjalanan',
    saved: 'Tersimpan',
    total: 'total',
    bookmarked: 'disimpan',
    given: 'diberi',
    available: 'tersedia',
    toExplore: 'untuk dijelajahi',
    destinations: 'Destinasi',
    trendTrips: 'perjalanan',
    trendPlaces: 'tempat',
    personalizedForYou: 'Dipersonalisasi untuk Anda',
    showingDestinationsFirst: 'Menampilkan destinasi {style} terlebih dahulu',
    planTrip: 'Rencanakan Perjalanan',
    getPersonalized: 'Dapatkan rekomendasi personal',
    takeQuizDesc: 'Ikuti kuis 1 menit untuk menemukan kecocokan sempurna Anda',
    takeQuiz: 'Ikuti Kuis',
    exploreSulawesi: 'Jelajahi Sulawesi',
    destinationsAvailable: '{count} destinasi tersedia',
    seeAll: 'Lihat semua →',
    perfectMatch: 'Cocok Sempurna',
    match: 'Cocok',
    myBookings: 'Pemesanan Saya',
    totalBookings: '{count} total pemesanan',
    noBookings: 'Belum ada pemesanan. Mulai jelajahi!',
    status: 'Status',
    details: 'Detail',
    explorer: 'Penjelajah',
    days: 'hari',
    confirmed: 'Terkonfirmasi',
    thisWeek: 'Minggu Ini',
    youMightLove: 'Mungkin Anda Suka',
    seeAllPlain: 'Lihat semua',
    moreDestinations: 'Destinasi lainnya segera hadir!',
    styleLabels: { adventure: 'Pencari Petualangan', culture: 'Penjelajah Budaya', nature: 'Pencinta Alam', culinary: 'Pencinta Kuliner' },
    barLabels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
    statusLabels: { confirmed: 'Terkonfirmasi', completed: 'Selesai', pending: 'Tertunda', cancelled: 'Dibatalkan' },
  },
}

function CategoryIcon({ name, size = 16 }: { name: string; size?: number }) {
  const s = { width: size, height: size, stroke: 'currentColor', strokeWidth: 2, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const icons: Record<string, ReactNode> = {
    all: <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    nature: <svg viewBox="0 0 24 24" {...s}><path d="M12 22c0-5 4-9 4-9s-4-3-4-9c0-5-4-3-4-3s4 3 4 9c0 5-4 9-4 9z"/><path d="M12 22c0-4-3-7-3-7s3-2 3-7c0-4 3-2 3-2s-3 2-3 7c0 5 3 7 3 7z"/></svg>,
    culture: <svg viewBox="0 0 24 24" {...s}><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M8 10s1.5 2 4 2 4-2 4-2"/><path d="M9 14h.01M15 14h.01"/></svg>,
    adventure: <svg viewBox="0 0 24 24" {...s}><path d="M12 22s-7-7.75-7-13c0-3.87 3.13-7 7-7s7 3.13 7 7c0 5.25-7 13-7 13z"/><circle cx="12" cy="9" r="2.5"/><path d="M7 16l3-2 2 3 3-5"/></svg>,
    village: <svg viewBox="0 0 24 24" {...s}><path d="M3 21h18"/><path d="M5 21V7l7-5 7 5v14"/><path d="M9 21v-8a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v8"/></svg>,
    coastal: <svg viewBox="0 0 24 24" {...s}><path d="M12 22c4.97 0 9-4.03 9-9V7c0-3.5-3.5-6-9-6S3 3.5 3 7v6c0 4.97 4.03 9 9 9z"/><path d="M2 12h20"/><path d="M12 2v20"/></svg>,
  }
  return icons[name] || icons.all
}

const barData = [3, 7, 2, 9, 5, 11, 6]

function matchScore(dest: any, prefs: any): number {
  let score = 0
  const style = prefs.style
  const budget = prefs.budget
  if (style === 'adventure' && (dest.category === 'Diving' || dest.category === 'Nature')) score += 2
  if (style === 'culture' && dest.category === 'Cultural') score += 2
  if (style === 'nature' && dest.category === 'Nature') score += 2
  if (style === 'culinary' && dest.city === 'Makassar') score += 1
  if (budget === 'budget' && dest.price < 150000) score += 1
  if (budget === 'standard' && dest.price >= 100000 && dest.price <= 600000) score += 1
  if (budget === 'premium' && dest.price >= 300000) score += 1
  if (budget === 'luxury' && dest.price >= 500000) score += 1
  return score
}

export default function TouristDashboard() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const txt = t[lang]
  const [saved, setSaved] = useState<number[]>(getSavedIds())
  const currentUser = getStoredUser()
  const prefs = JSON.parse(localStorage.getItem('gosulawesi_preferences') || '{}')
  const [stats, setStats] = useState<any>(null)
  const [destinations, setDestinations] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])

  const styleLabel: Record<string, string> = txt.styleLabels

  const toggleSaved = (id: number) => setSaved(toggleSavedId(id))

  const [activeCategory, setActiveCategory] = useState('all')
  const categoryMatches = (dest: any, filter: string) => {
    if (filter === 'all') return true
    const cat = (dest.category || '').toLowerCase()
    if (filter === 'nature') return cat.includes('nature') || cat.includes('natural')
    if (filter === 'culture') return cat.includes('culture') || cat.includes('cultural')
    if (filter === 'adventure') return cat.includes('adventure') || cat.includes('diving') || cat.includes('hiking') || cat.includes('trek')
    if (filter === 'village') return cat.includes('village')
    if (filter === 'coastal') return cat.includes('coastal') || cat.includes('beach') || cat.includes('sea') || cat.includes('island')
    return false
  }
  const filteredDestinations = destinations.filter(d => categoryMatches(d, activeCategory))

  useEffect(() => {
    if (!currentUser) {
      navigate('/login')
      return
    }
    Promise.all([
      api.getDashboard(),
      api.getDestinations(),
      api.getBookings(),
    ]).then(([dash, dests, bkgs]) => {
      setStats(dash)
      const sorted = [...(dests.destinations || [])].sort((a, b) => matchScore(b, prefs) - matchScore(a, prefs))
      setDestinations(sorted)
      setBookings(bkgs.bookings || [])
    }).catch(() => {})
  }, [navigate])

  const rightPanel = (
    <>

            {/* ── Traveler Profile Card ── */}
            <div className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${A} 0%, #0891b2 100%)`, padding: '20px 20px 0' }}>
              <div className="absolute top-0 right-0 opacity-10">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white flex-shrink-0"
                    style={{ border: '3px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.15)' }}>
                    {currentUser?.name?.charAt(0) || 'T'}
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: A, color: 'white' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  </span>
                </div>
                <div>
                  <p className="text-white font-black text-base leading-tight">{currentUser?.name || 'Tourist'}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>{txt.explorer} · {currentUser?.role}</p>
                </div>
              </div>
              {/* Stats row inside card */}
              <div className="flex" style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 12, paddingBottom: 16 }}>
                {[{ v: stats?.total_bookings ?? 0, l: txt.tripsTaken }, { v: saved.length, l: txt.saved }, { v: stats?.total_reviews ?? 0, l: txt.reviews }].map((s, i, arr) => (
                  <div key={s.l} className="flex-1 text-center" style={{ borderRight: i < arr.length-1 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
                    <p className="font-black text-white text-base">{s.v}</p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 space-y-4">

              {/* ── Next Trip Countdown ── */}
              {(() => {
                const nextTrip = bookings[0]
                const tripDate = nextTrip?.booking_date ? new Date(nextTrip.booking_date) : null
                const daysUntil = tripDate ? Math.max(0, Math.ceil((tripDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0
                return (
                  <div className="rounded-2xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}`, boxShadow: shadow }}>
                    <div className="relative h-20 overflow-hidden">
                      <img src="/img/Danau Tanralili.jpg" alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.2))' }} />
                      <div className="absolute inset-0 flex items-center px-4 gap-3">
                        <div className="flex-1">
                          <p className="text-white font-bold text-sm">{nextTrip?.destination_name || nextTrip?.business_name || 'Danau Tanralili'}</p>
                          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                            {tripDate ? tripDate.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'May 18, 2026'}
                          </p>
                        </div>
                        <div className="text-center bg-white rounded-xl px-3 py-2">
                          <p className="font-black text-xl leading-none" style={{ color: A }}>{daysUntil}</p>
                          <p style={{ color: SUBTLE, fontSize: 10 }}>{txt.days}</p>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 flex items-center gap-2">
                      <img src="/img-local/1.jpg" alt="" className="w-6 h-6 rounded-full object-cover" />
                      <span className="text-xs flex-1" style={{ color: MUTED }}>{nextTrip?.guide_name || nextTrip?.user_name || 'Andi Kurniawan · Nature Guide'}</span>
                      <span className="text-xs font-bold" style={{ color: '#15803d' }}>{nextTrip?.status ? (txt.statusLabels?.[nextTrip.status] || nextTrip.status) : txt.confirmed}</span>
                    </div>
                  </div>
                )
              })()}

              {/* ── Activity Sparkline ── */}
              <div className="rounded-2xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}`, boxShadow: shadow }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold" style={{ color: TEXT }}>{txt.thisWeek}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: AL, color: A }}>+23%</span>
                </div>
                <div className="relative">
                  {[10, 6, 2].map((label) => (
                    <div key={label} className="flex items-center gap-2 absolute w-full" style={{ bottom: `${(label / 12) * 72}px` }}>
                      <span style={{ color: SUBTLE, fontSize: 9, width: 14, textAlign: 'right', flexShrink: 0 }}>{label}</span>
                      <div className="flex-1 border-t border-dashed" style={{ borderColor: '#f1f5f9' }} />
                    </div>
                  ))}
                  <div className="flex items-end gap-1 pl-5 pb-4" style={{ height: 80 }}>
                    {barData.map((v, i) => (
                      <div key={i} className="flex-1 rounded-t-lg transition-all"
                        style={{ height: `${(v / 12) * 62}px`, background: i === 5 ? A : AL, minHeight: 6 }} />
                    ))}
                  </div>
                  <div className="flex pl-5 gap-1">
                    {txt.barLabels.map((l: string, i: number) => (
                      <div key={i} className="flex-1 text-center" style={{ color: SUBTLE, fontSize: 9 }}>{l}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Suggested Places ── */}
              <div className="rounded-2xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}`, boxShadow: shadow }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold" style={{ color: TEXT }}>{txt.youMightLove}</p>
                  <button onClick={() => navigate('/tourist/saved')}
                    className="text-xs font-medium border-0 bg-transparent cursor-pointer" style={{ color: A }}>{txt.seeAllPlain}</button>
                </div>
                <div className="space-y-0">
                  {(filteredDestinations || []).slice(3, 6).map((p, i, arr) => (
                    <div key={i}>
                      <div className="flex items-center gap-3 py-3 cursor-pointer" onClick={() => navigate(`/destination/${p.id}`)}>
                        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: A }}>
                          {p.name?.charAt(0) || 'D'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate" style={{ color: TEXT }}>{p.name}</p>
                          <p className="flex items-center gap-1 text-xs" style={{ color: SUBTLE }}>
                            {p.city} ·
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            {p.rating}
                          </p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); toggleSaved(p.id) }}
                          className="w-7 h-7 rounded-full flex items-center justify-center border-0 cursor-pointer flex-shrink-0 transition-all"
                          style={{ background: saved.includes(p.id) ? '#f43f5e' : AL }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill={saved.includes(p.id) ? 'white' : 'none'} stroke={saved.includes(p.id) ? 'white' : A} strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                          </svg>
                        </button>
                      </div>
                      {i < arr.length - 1 && <div style={{ borderTop: `1px solid ${BORDER}` }} />}
                    </div>
                  ))}
                  {filteredDestinations.length <= 3 && (
                    <p className="text-xs text-center py-4" style={{ color: SUBTLE }}>{txt.moreDestinations}</p>
                  )}
                </div>
              </div>
            </div>
    </>
  )

  return (
    <TouristLayout rightPanel={rightPanel}>


            {/* ── Hero Full Bleed ── */}
            <div className="relative overflow-hidden cursor-pointer group" style={{ height: 240 }}
              onClick={() => filteredDestinations[0]?.id && navigate(`/destination/${filteredDestinations[0].id}`)}>
              <img src={filteredDestinations[0]?.image_url || '/img/Danau Tanralili.jpg'} alt="hero"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(135deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.05) 100%)'
              }} />
              {/* top strip */}
              <div className="absolute top-4 left-6 right-6 flex items-center justify-between">
                <span className="text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.15)', color: 'white', backdropFilter: 'blur(8px)' }}>
                  ✦ {txt.featuredToday}
                </span>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                  style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="#fbbf24" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <span className="text-white text-xs font-bold">{filteredDestinations[0]?.rating || '4.9'}</span>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>· {filteredDestinations[0]?.reviews_count ?? 12} {txt.reviewsCount}</span>
                </div>
              </div>
              {/* bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display:'inline', marginRight:4 }}>
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  </svg>
                  {filteredDestinations[0]?.city || 'Gowa, South Sulawesi'}
                </p>
                <h2 className="text-2xl font-black text-white mb-4" style={{ letterSpacing: '-0.03em' }}>{filteredDestinations[0]?.name || 'Danau Tanralili'}</h2>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); filteredDestinations[0]?.id && navigate(`/destination/${filteredDestinations[0].id}`) }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border-0 cursor-pointer transition-transform hover:scale-105"
                    style={{ background: A, color: 'white', boxShadow: `0 4px 14px ${A}66` }}>
                    {txt.bookNow} · Rp {Number(filteredDestinations[0]?.price || 0).toLocaleString('id-ID')}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); toggleSaved(filteredDestinations[0]?.id ?? 99) }}
                    className="w-9 h-9 rounded-full flex items-center justify-center border-0 cursor-pointer transition-all hover:scale-110"
                    style={{ background: saved.includes(filteredDestinations[0]?.id ?? 99) ? '#f43f5e' : 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill={saved.includes(filteredDestinations[0]?.id ?? 99) ? 'white' : 'none'} stroke="white" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">

              {/* ── Category Filter Pills ── */}
              <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
                {[
                  { id: 'all', label: txt.all },
                  { id: 'nature', label: txt.nature },
                  { id: 'culture', label: txt.culture },
                  { id: 'adventure', label: txt.adventure },
                  { id: 'village', label: txt.village },
                  { id: 'coastal', label: txt.coastal },
                ].map(c => (
                  <button key={c.id} onClick={() => setActiveCategory(c.id)}
                    className="flex items-center gap-1.5 flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border-0 cursor-pointer transition-all"
                    style={{
                      background: activeCategory === c.id ? A : CARD,
                      color: activeCategory === c.id ? 'white' : MUTED,
                      border: `1px solid ${activeCategory === c.id ? A : BORDER}`,
                      boxShadow: activeCategory === c.id ? `0 2px 8px ${A}44` : 'none',
                    }}>
                    <CategoryIcon name={c.id} size={16} />
                    {c.label}
                  </button>
                ))}
              </div>

              {/* ── Travel Stats ── */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  { icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    ), label: txt.tripsTaken, value: stats?.total_bookings ?? 0, trend: txt.trendTrips, trendUp: true, sub: txt.total, bg: A, light: AL },
                  { icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    ), label: txt.saved, value: saved.length, trend: txt.trendPlaces, trendUp: true, sub: txt.bookmarked, bg: '#7c3aed', light: '#f5f3ff' },
                  { icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="none">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    ), label: txt.reviews, value: stats?.total_reviews ?? 0, trend: txt.given, trendUp: true, sub: txt.total, bg: '#d97706', light: '#fffbeb' },
                  { icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                    ), label: txt.destinations, value: destinations.length, trend: txt.available, trendUp: true, sub: txt.toExplore, bg: '#0891b2', light: '#ecfeff' },
                ].map(s => (
                  <div key={s.label} className="rounded-2xl p-4 relative overflow-hidden"
                    style={{ background: CARD, border: `1px solid ${BORDER}`, boxShadow: shadow }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: s.bg }}>
                      {s.icon}
                    </div>
                    <p className="text-2xl font-black leading-none mb-1" style={{ color: TEXT, letterSpacing: '-0.03em' }}>{s.value}</p>
                    <p className="text-xs font-medium" style={{ color: MUTED }}>{s.label}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded-md" style={{ background: s.light, color: s.bg }}>
                        ↑ {s.trend}
                      </span>
                      <span style={{ color: SUBTLE, fontSize: 10 }}>{s.sub}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Personalization Banner ── */}
              {prefs.style && !prefs.skipped && (
                <div className="mb-5 px-4 py-3 rounded-2xl flex flex-col md:flex-row md:items-center gap-3"
                  style={{ background: AL, border: `1px solid ${A}33` }}>
                  <span className="text-xl flex-shrink-0" style={{ color: A }}><CategoryIcon name={prefs.style} size={22} /></span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold" style={{ color: A }}>{txt.personalizedForYou}</p>
                    <p className="text-xs" style={{ color: MUTED }}>{txt.showingDestinationsFirst.replace('{style}', styleLabel[prefs.style] ?? txt.explorer)}</p>
                  </div>
                  <Link to="/itinerary" className="self-start md:self-auto flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl no-underline flex-shrink-0"
                    style={{ background: A, color: 'white' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                    {txt.planTrip}
                  </Link>
                </div>
              )}
              {!prefs.style && (
                <div className="mb-5 px-4 py-3 rounded-2xl flex flex-col md:flex-row md:items-center gap-3"
                  style={{ background: '#f0fdfa', border: `1px solid #0d948833` }}>
                  <span className="text-xl flex-shrink-0" style={{ color: '#0d9488' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5z"/></svg>
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold" style={{ color: '#0d9488' }}>{txt.getPersonalized}</p>
                    <p className="text-xs" style={{ color: MUTED }}>{txt.takeQuizDesc}</p>
                  </div>
                  <Link to="/quiz" className="self-start md:self-auto text-xs font-bold px-3 py-1.5 rounded-xl no-underline flex-shrink-0"
                    style={{ background: '#0d9488', color: 'white' }}>{txt.takeQuiz}</Link>
                </div>
              )}

              {/* ── Explore Grid ── */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-black text-base" style={{ color: TEXT, letterSpacing: '-0.02em' }}>{txt.exploreSulawesi}</h3>
                    <p className="text-xs mt-0.5" style={{ color: SUBTLE }}>{txt.destinationsAvailable.replace('{count}', String(filteredDestinations.length))}</p>
                  </div>
                  <button onClick={() => navigate('/tourist')}
                    className="text-xs font-semibold border-0 bg-transparent cursor-pointer px-3 py-1.5 rounded-lg transition-colors hover:bg-gray-100" style={{ color: A }}>{txt.seeAll}</button>
                </div>

                {/* Magazine layout: 1 large + 2 small */}
                <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr', gridTemplateRows: '160px 160px' }}>
                  {/* Big card spans 2 rows */}
                  {filteredDestinations[0] && (
                  <div className="rounded-2xl overflow-hidden cursor-pointer group relative" style={{ gridRow: 'span 2' }}
                    onClick={() => navigate(`/destination/${filteredDestinations[0].id}`)}>
                    <img src={filteredDestinations[0].image_url || '/img/Danau Tanralili.jpg'} alt=""
                      className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%)' }} />
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      <span className="text-xs px-2.5 py-1 rounded-full font-bold" style={{ background: '#7c3aed', color: 'white' }}>{filteredDestinations[0].category?.toUpperCase()}</span>
                      {matchScore(filteredDestinations[0], prefs) >= 2 && (
                        <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-bold" style={{ background: '#fbbf24', color: '#1c1917' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5z"/></svg>
                          {txt.perfectMatch}
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-black text-base leading-tight mb-1">{filteredDestinations[0].name}</p>
                      <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.65)' }}>{filteredDestinations[0].city}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="flex items-center gap-1 text-xs font-bold" style={{ color: '#fbbf24' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                          {filteredDestinations[0].rating}
                        </span>
                        <span className="text-xs font-bold text-white px-2 py-1 rounded-full" style={{ background: A }}>
                          Rp {Number(filteredDestinations[0].price || 0).toLocaleString('id-ID')}
                        </span>
                        <a href={`https://wa.me/628123456789?text=Hello! I'm interested in ${encodeURIComponent(filteredDestinations[0]?.name || '')}. Can you guide me?`}
                          target="_blank" rel="noopener noreferrer"
                          className="text-xs font-bold px-2 py-1 rounded-full no-underline flex items-center gap-1"
                          style={{ background: '#25d366', color: 'white' }}
                          onClick={e => e.stopPropagation()}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                          WhatsApp
                        </a>
                      </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); toggleSaved(filteredDestinations[0]?.id ?? 1) }}
                      className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center border-0 cursor-pointer"
                      style={{ background: saved.includes(filteredDestinations[0]?.id ?? 1) ? '#f43f5e' : 'rgba(255,255,255,0.8)' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill={saved.includes(filteredDestinations[0]?.id ?? 1) ? 'white' : 'none'} stroke={saved.includes(filteredDestinations[0]?.id ?? 1) ? 'white' : '#374151'} strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>
                  </div>
                  )}
                  {/* Small cards */}
                  {(filteredDestinations[1] || filteredDestinations[2]) && [filteredDestinations[1], filteredDestinations[2]].filter(Boolean).map((c, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden cursor-pointer group relative"
                      onClick={() => navigate(`/destination/${c.id}`)}>
                      <img src={c.image_url || '/img/Desa_Bonto_Manai.jpg'} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: A, color: 'white', fontSize: 10 }}>{c.category?.toUpperCase()}</span>
                        {matchScore(c, prefs) >= 2 && (
                          <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: '#fbbf24', color: '#1c1917', fontSize: 10 }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5z"/></svg>
                            {txt.match}
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white font-bold text-sm leading-tight">{c.name}</p>
                        <p className="flex items-center gap-1 text-xs" style={{ color: '#fbbf24' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                          {c.rating}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Upcoming Adventures ── */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-black text-base" style={{ color: TEXT, letterSpacing: '-0.02em' }}>{txt.myBookings}</h3>
                    <p className="text-xs mt-0.5" style={{ color: SUBTLE }}>{txt.totalBookings.replace('{count}', String(bookings.length))}</p>
                  </div>
                  <button className="text-xs font-semibold border-0 bg-transparent cursor-pointer px-3 py-1.5 rounded-lg hover:bg-gray-100" style={{ color: A }}>{txt.seeAll}</button>
                </div>
                <div className="space-y-3">
                  {bookings.length === 0 && (
                    <div className="text-center py-8 rounded-2xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                      <p className="text-sm" style={{ color: SUBTLE }}>{txt.noBookings}</p>
                    </div>
                  )}
                  {bookings.map((t, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all hover:translate-y-[-1px]"
                      style={{ background: CARD, border: `1px solid ${BORDER}`, boxShadow: shadow }}>
                      <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: A }}>
                          {t.destination_name?.charAt(0) || t.business_name?.charAt(0) || 'B'}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm" style={{ color: TEXT }}>{t.destination_name || t.business_name || 'Booking'}</p>
                        <p className="text-xs mt-0.5" style={{ color: MUTED }}>{txt.status}: {t.status}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-xs" style={{ color: SUBTLE }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            {t.booking_date}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                            style={{ background: t.status==='confirmed'?'#dcfce7':t.status==='completed'?'#dbeafe':'#ffedd5', color: t.status==='confirmed'?'#15803d':t.status==='completed'?'#1d4ed8':'#c2410c' }}>
                            {t.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-black text-base" style={{ color: TEXT }}>Rp {Number(t.total_price || 0).toLocaleString('id-ID')}</p>
                        <button className="mt-2 text-xs px-3 py-1 rounded-full font-semibold border-0 cursor-pointer"
                          style={{ background: AL, color: A }}>{txt.details}</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
    </TouristLayout>
  )
}
