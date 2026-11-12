from lib import *
# "One whole": one plate, two materials. Left: gold iron weight plate. Right: porcelain dinner plate.
# The rings run straight across the gap, so the two halves read as one object.
def svg(kind='dark',gap=24,R=360,tint=False):
    iron='#E8E8E8' if tint else 'url(#iron)'; rim='#F4F4F4' if tint else 'url(#ironRim)'
    china='#9C9C9C' if tint else 'url(#china)'; line='#7A7A7A' if tint else '#D9A632'
    bgfill='#121212' if tint else 'url(#bg)'
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><defs>{bg(kind)}{GOLD}{drop(kind)}
<radialGradient id="china" cx=".8" cy=".15" r="1.1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".5" stop-color="#F3F4F6"/><stop offset=".85" stop-color="#D5D8DE"/><stop offset="1" stop-color="#B2B7C0"/></radialGradient>
<radialGradient id="ironWell" cx=".3" cy=".25" r=".9"><stop offset="0" stop-color="#F6C752"/><stop offset="1" stop-color="#A86A0C"/></radialGradient>
<radialGradient id="chinaWell" cx=".7" cy=".25" r=".9"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E4E7EC"/></radialGradient>
<clipPath id="L"><rect x="0" y="0" width="{512-gap/2}" height="1024"/></clipPath>
<clipPath id="R"><rect x="{512+gap/2}" y="0" width="1024" height="1024"/></clipPath></defs>
<rect width="1024" height="1024" fill="{bgfill}"/>
<g filter="url(#drop)">
 <g clip-path="url(#L)">
  <circle cx="512" cy="512" r="{R}" fill="{iron}"/>
  <circle cx="512" cy="512" r="{R-16}" fill="none" stroke="{rim}" stroke-width="30"/>
  <circle cx="512" cy="512" r="{int(R*.66)}" fill="{'#D8D8D8' if tint else 'url(#ironWell)'}"/>
  <circle cx="512" cy="512" r="{int(R*.66)}" fill="none" stroke="#FFF0B8" stroke-opacity=".7" stroke-width="5"/>
  <circle cx="512" cy="512" r="{int(R*.24)}" fill="{'#F4F4F4' if tint else 'url(#steel)'}"/>
  <circle cx="512" cy="512" r="{int(R*.24)-12}" fill="none" stroke="#FFFFFF" stroke-opacity=".7" stroke-width="4"/>
  {'' if tint else f'<path d="{arc(R-46,198,254)}" fill="none" stroke="#FFFBE6" stroke-width="14" stroke-linecap="round" opacity=".85"/>'}
 </g>
 <g clip-path="url(#R)">
  <circle cx="512" cy="512" r="{R}" fill="{china}"/>
  <circle cx="512" cy="512" r="{int(R*.66)}" fill="{'#8A8A8A' if tint else 'url(#chinaWell)'}"/>
  <circle cx="512" cy="512" r="{int(R*.66)}" fill="none" stroke="#AEB3BC" stroke-width="5"/>
  <circle cx="512" cy="512" r="{R-48}" fill="none" stroke="{line}" stroke-width="7"/>
  {'' if tint else f'<path d="{arc(R-22,288,338)}" fill="none" stroke="#fff" stroke-width="15" stroke-linecap="round"/>'}
 </g>
</g></svg>'''
open('c1-dark.svg','w').write(svg('dark'));open('c1-light.svg','w').write(svg('light'));open('c1-tint.svg','w').write(svg('dark',tint=True))
