export interface User {
  id: string
  name: string
  username: string
  role: "admin" | "operator"
  created_at: string
  updated_at: string
}

export interface BroadcastReport {
  id: string
  tanggal: string
  jam_mulai: string
  jam_selesai: string
  program: string
  kualitas_siaran?: "Baik" | "Tidak Baik" // Keep for backward compatibility
  kualitas_video: "Baik" | "Tidak Baik"
  kualitas_audio: "Baik" | "Tidak Baik"
  petugas: string[]
  kendala?: string
  penanganan?: string
  keterangan?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface LoginForm {
  username: string
  password: string
}

export interface ReportForm {
  tanggal: string
  jam_mulai: string
  jam_selesai: string
  program: string
  kualitas_siaran?: "Baik" | "Tidak Baik" // Keep for backward compatibility
  kualitas_video: "Baik" | "Tidak Baik"
  kualitas_audio: "Baik" | "Tidak Baik"
  petugas: string[]
  kendala: string
  penanganan: string
  keterangan: string
}
