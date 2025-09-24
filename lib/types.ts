export interface User {
  id: string
  name: string
  username: string
  role: "admin" | "operator"
  nip: string
  jabatan: string
  created_at: string
  updated_at: string
}

// lib/types.ts
export interface BroadcastReport {
  id: string
  tanggal: string
  jam_mulai: string
  jam_selesai: string
  program: string
  kualitas_video: string
  kualitas_audio: string
  petugas: string[]
  kendala: string
  penanganan: string
  keterangan: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface ReportForm {
  tanggal: string
  jam_mulai: string
  jam_selesai: string
  program: string
  kualitas_video: string
  kualitas_audio: string
  petugas: string[]
  kendala: string
  penanganan: string
  keterangan: string
}

export interface LoginForm {
  username: string
  password: string
}
