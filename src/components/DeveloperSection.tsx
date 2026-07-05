const VALUES = [
  {
    title: 'אדריכלות של מקום',
    desc: 'כל פרויקט מתחיל מהנוף — הבניין נבנה סביבו, לא להפך.',
  },
  {
    title: 'גימור ללא פשרות',
    desc: 'חומרים טבעיים, פרטים מדויקים, ולוחות זמנים שאנחנו עומדים בהם.',
  },
  {
    title: 'ליווי אישי',
    desc: 'מהרגע הראשון ועד מסירת המפתח — איש קשר אחד, זמין ואחראי.',
  },
]

export default function DeveloperSection() {
  return (
    <section
      id="developer"
      aria-label="אודות היזם"
      className="relative border-t hairline bg-bg px-6 py-24 md:px-[8vw] md:py-32"
    >
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
        <div>
          <p className="eyebrow-he">אודות היזם</p>
          <h2 className="mt-5 font-display text-[clamp(2.2rem,5vw,4rem)] font-light leading-tight text-sand">
            לאגו גרופ
          </h2>
          <p className="mt-3 text-sm tracking-[0.2em] text-gold/80">
            LAGO GROUP
          </p>
        </div>

        <div>
          <p className="font-display text-2xl font-light leading-relaxed text-sand/90 md:text-[1.7rem]">
            אנחנו בונים מספר קטן של פרויקטים — כל אחד במקום שראוי לו. LAGO
            Residences הוא הביטוי המלא של הגישה הזו: מגדל יחיד על קו המים של
            הכנרת, שנועד להחזיר את הנוף אל הבית.
          </p>
          <p className="mt-6 text-lg font-light leading-8 text-sand/60">
            מהאדריכלות ועד הקונסיירז׳, כל החלטה נמדדת בשאלה אחת — האם היא
            מוסיפה לרגע שבו הדייר עוצר מול האגם.
          </p>

          <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title}>
                <div className="h-px w-10 bg-gold/60" />
                <h3 className="mt-5 font-display text-xl font-light text-sand">
                  {v.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-sand/60">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
