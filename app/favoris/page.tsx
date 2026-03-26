export default function FavorisPage() {
  return (
    <div style={{ paddingTop: '80px', padding: '80px 16px 120px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{
        fontFamily: 'var(--font-syne), Syne, sans-serif',
        fontWeight: 800,
        fontSize: 'clamp(24px, 5vw, 40px)',
        marginBottom: '12px',
      }}>
        Mes <em style={{ color: 'var(--green)', fontStyle: 'normal' }}>favoris</em>
      </h1>
      <p style={{ color: 'var(--text-muted)' }}>
        Vos crampons sauvegardés apparaîtront ici.
      </p>
    </div>
  )
}
