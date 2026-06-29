import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, getStoredUser } from '../lib/api'
import { useLang, type Lang } from '../hooks/useLang'
import BusinessLayout from '../components/BusinessLayout'

const A = '#ea580c'
const AL = '#fff7ed'
const TEXT = '#111827'
const MUTED = '#6b7280'
const SUBTLE = '#9ca3af'
const BORDER = '#e5e7eb'
const CARD = '#ffffff'
const shadow = '0 1px 4px rgba(0,0,0,0.07)'

const t: Record<Lang, any> = {
  en: {
    pageTitle: 'My Listings',
    pageSub: 'Manage your business listings and services',
    searchPlaceholder: 'Search listings…',
    loading: 'Loading listings...',
    noListings: 'No listings yet. Create your first business listing.',
    edit: 'Edit',
    delete: 'Delete',
    deleteConfirm: 'Are you sure you want to delete this listing?',
    editTitle: 'Edit Listing',
    businessName: 'Business Name',
    businessType: 'Business Type',
    city: 'City',
    phone: 'Phone',
    description: 'Description',
    save: 'Save Changes',
    saving: 'Saving...',
    cancel: 'Cancel',
    saved: 'Listing saved successfully',
    error: 'Failed to save listing',
    deleteError: 'Failed to delete listing',
  },
  id: {
    pageTitle: 'Daftar Saya',
    pageSub: 'Kelola daftar bisnis dan layanan Anda',
    searchPlaceholder: 'Cari daftar…',
    loading: 'Memuat daftar...',
    noListings: 'Belum ada daftar. Buat daftar bisnis pertama Anda.',
    edit: 'Edit',
    delete: 'Hapus',
    deleteConfirm: 'Apakah Anda yakin ingin menghapus daftar ini?',
    editTitle: 'Edit Daftar',
    businessName: 'Nama Bisnis',
    businessType: 'Jenis Bisnis',
    city: 'Kota',
    phone: 'Telepon',
    description: 'Deskripsi',
    save: 'Simpan Perubahan',
    saving: 'Menyimpan...',
    cancel: 'Batal',
    saved: 'Daftar berhasil disimpan',
    error: 'Gagal menyimpan daftar',
    deleteError: 'Gagal menghapus daftar',
  },
}

export default function BusinessListingsPage() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const txt = t[lang]
  const currentUser = getStoredUser()
  const [businesses, setBusinesses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ business_name: '', business_type: '', city: '', phone: '', description: '', status: 'pending' })

  useEffect(() => {
    if (!currentUser) {
      navigate('/login')
      return
    }
    fetchBusinesses()
  }, [navigate])

  const fetchBusinesses = () => {
    setLoading(true)
    api.getBusinesses().then(r => {
      setBusinesses(r.businesses || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  const startEdit = (b: any) => {
    setEditing(b)
    setForm({
      business_name: b.business_name || '',
      business_type: b.business_type || '',
      city: b.city || '',
      phone: b.phone || '',
      description: b.description || '',
      status: b.status || 'pending',
    })
    setError('')
    setSuccess('')
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await api.updateBusiness(editing.id, form)
      setSuccess(txt.saved)
      fetchBusinesses()
      setEditing(null)
    } catch (err: any) {
      setError(err.message || txt.error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm(txt.deleteConfirm)) return
    try {
      await api.deleteBusiness(id)
      fetchBusinesses()
    } catch (err: any) {
      setError(err.message || txt.deleteError)
    }
  }

  return (
    <BusinessLayout>

      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-black mb-1" style={{ color: TEXT }}>{txt.pageTitle}</h1>
          <p className="text-sm" style={{ color: MUTED }}>{txt.pageSub}</p>
        </div>

        {error && (
          <div className="rounded-xl px-4 py-3 mb-4 text-sm font-semibold" style={{ background: '#fef2f2', color: '#dc2626', border: `1px solid #fecaca` }}>
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-xl px-4 py-3 mb-4 text-sm font-semibold" style={{ background: '#dcfce7', color: '#15803d', border: `1px solid #bbf7d0` }}>
            {success}
          </div>
        )}

        {loading ? (
          <p style={{ color: MUTED }}>{txt.loading}</p>
        ) : businesses.length === 0 ? (
          <div className="rounded-2xl p-8 text-center" style={{ background: CARD, border: `1px solid ${BORDER}`, boxShadow: shadow }}>
            <p className="text-sm" style={{ color: MUTED }}>{txt.noListings}</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {businesses.map(b => (
              <div key={b.id} className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}`, boxShadow: shadow }}>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center text-lg font-bold text-white" style={{ background: A }}>
                    {b.image_url ? <img src={b.image_url} alt="" className="w-full h-full object-cover" /> : b.business_name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-lg" style={{ color: TEXT }}>{b.business_name}</p>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: b.status === 'approved' ? '#dcfce7' : AL, color: b.status === 'approved' ? '#15803d' : A }}>
                        {b.status}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: MUTED }}>{b.business_type} · {b.city}</p>
                    <p className="text-sm mt-1" style={{ color: SUBTLE }}>{b.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(b)} className="px-4 py-2 rounded-xl text-sm font-bold text-white border-0 cursor-pointer transition-all hover:opacity-90" style={{ background: A }}>{txt.edit}</button>
                    <button onClick={() => handleDelete(b.id)} className="px-4 py-2 rounded-xl text-sm font-bold text-white border-0 cursor-pointer transition-all hover:opacity-90" style={{ background: '#ef4444' }}>{txt.delete}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setEditing(null)}>
            <div className="rounded-2xl p-6 w-full max-w-lg" style={{ background: CARD }} onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-4" style={{ color: TEXT }}>{txt.editTitle}</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: SUBTLE }}>{txt.businessName}</label>
                  <input value={form.business_name} onChange={e => setForm({ ...form, business_name: e.target.value })} required
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: '#f9fafb', border: `1px solid ${BORDER}`, color: TEXT }} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: SUBTLE }}>{txt.businessType}</label>
                    <input value={form.business_type} onChange={e => setForm({ ...form, business_type: e.target.value })} required
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: '#f9fafb', border: `1px solid ${BORDER}`, color: TEXT }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: SUBTLE }}>{txt.city}</label>
                    <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: '#f9fafb', border: `1px solid ${BORDER}`, color: TEXT }} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: SUBTLE }}>{txt.phone}</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: '#f9fafb', border: `1px solid ${BORDER}`, color: TEXT }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: SUBTLE }}>{txt.description}</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ background: '#f9fafb', border: `1px solid ${BORDER}`, color: TEXT }} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white border-0 cursor-pointer transition-all hover:opacity-90 disabled:opacity-60" style={{ background: A }}>
                    {saving ? txt.saving : txt.save}
                  </button>
                  <button type="button" onClick={() => setEditing(null)} className="px-4 py-3 rounded-xl text-sm font-bold border-0 cursor-pointer transition-all" style={{ background: '#f3f4f6', color: MUTED }}>
                    {txt.cancel}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

    </BusinessLayout>
  )
}
