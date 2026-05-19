import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-emerald-600 mb-4">
          MyRecord
        </h1>
        <p className="text-lg text-gray-600">
          O seu acervo musical.
        </p>
      </div>
    </main>
  )
}