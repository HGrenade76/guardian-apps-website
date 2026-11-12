from lib import *
# Concept 2 "Loaded 2": the numeral 2 drawn as equipment. Its bowl is a plate (rim + hub), its base is a loaded bar.
def svg(kind='dark'):
    cx,cy,r=512,392,178
    x0,y0=pt(r,168,cx,cy); x1,y1=pt(r,28,cx,cy)
    plate='#2B2D33' if kind=='light' else 'url(#steelV)'
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><defs>{bg(kind)}{GOLD}{drop(kind)}
<clipPath id="above"><rect x="0" y="0" width="1024" height="780"/></clipPath></defs>
<rect width="1024" height="1024" fill="url(#bg)"/>
<g filter="url(#drop)">
 <path d="M{x0:.1f} {y0:.1f} A{r} {r} 0 1 1 {x1:.1f} {y1:.1f} L 372 780" fill="none" stroke="url(#goldLin)" stroke-width="124" stroke-linecap="round" stroke-linejoin="round" clip-path="url(#above)"/>
 <path d="{arc(r+40,200,262,cx,cy)}" fill="none" stroke="#FFF7D6" stroke-width="12" stroke-linecap="round" opacity=".8"/>
 
 <rect x="236" y="752" width="552" height="56" rx="28" fill="url(#goldLin)"/>
 <rect x="182" y="650" width="82" height="260" rx="30" fill="{plate}"/>
 <rect x="760" y="650" width="82" height="260" rx="30" fill="{plate}"/>
 <rect x="150" y="700" width="40" height="160" rx="16" fill="{plate}" opacity=".8"/>
 <rect x="834" y="700" width="40" height="160" rx="16" fill="{plate}" opacity=".8"/>
</g></svg>'''
for k in ('dark','light'): open(f'c2-{k}.svg','w').write(svg(k))
