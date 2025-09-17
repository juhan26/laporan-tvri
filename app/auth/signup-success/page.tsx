import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="bg-green-100 text-green-600 p-4 rounded-full mb-4 mx-auto w-fit">
            <CheckCircle className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">Pendaftaran Berhasil!</CardTitle>
          <CardDescription>Akun Anda telah berhasil dibuat</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Silakan periksa email Anda untuk konfirmasi akun sebelum melakukan login.
          </p>
          <Button asChild className="w-full bg-blue-800 hover:bg-blue-900">
            <Link href="/auth/login">Kembali ke Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
