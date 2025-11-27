export function StatsSection() {
  const stats = [
    { label: 'Images generated', value: '100k+' },
    { label: 'Active creators', value: '5,000+' },
    { label: 'Time saved', value: '90%' },
    { label: 'Conversion boost', value: '2x' },
  ]

  return (
    <section className="border-y bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="text-3xl md:text-4xl font-bold text-primary">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}



