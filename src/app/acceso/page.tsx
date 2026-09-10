import type { Metadata } from 'next'
import { AccesoGate } from '@/features/pass/components/AccesoGate'

export const metadata: Metadata = {
  title: 'Acceso · Team1 Workshop Pass',
  description: 'Contenido reservado para quienes tienen el pass.',
}

export default function AccesoPage() {
  return <AccesoGate />
}
