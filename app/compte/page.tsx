export default function ComptePage() {
  return (
    <div style={{ paddingTop: '80px', padding: '80px 16px 120px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{
        fontFamily: 'var(--font-syne), Syne, sans-serif',
        fontWeight: 800,
        fontSize: 'clamp(24px, 5vw, 40px)',
        marginBottom: '12px',
      }}>
        Mon <em style={{ color: 'var(--green)', fontStyle: 'normal' }}>compte</em>
      </h1>
      <p style={{ color: 'var(--text-muted)' }}>
        Connexion & gestion du profil — à venir.
      </p>
    </div>
  )
}
