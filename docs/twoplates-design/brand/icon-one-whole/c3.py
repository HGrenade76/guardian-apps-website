from lib import *
# Concept 3 "Pair": two plates, side by side, in Liquid Glass. Gold you, glass buddy, overlapping where you meet.
def plate(cx,cy,R,fill,rim,hl,a0,a1,idp):
    return f'''<circle cx="{cx}" cy="{cy}" r="{R}" fill="{fill}"/>
<circle cx="{cx}" cy="{cy}" r="{R-16}" fill="none" stroke="{rim}" stroke-width="22" opacity=".9"/>
<circle cx="{cx}" cy="{cy}" r="{int(R*.55)}" fill="none" stroke="{rim}" stroke-width="6" opacity=".55"/>
<circle cx="{cx}" cy="{cy}" r="{int(R*.26)}" fill="url(#steel)"/><circle cx="{cx}" cy="{cy}" r="{int(R*.11)}" fill="#0B0B0D" opacity=".85"/>
<path d="{arc(R-40,a0,a1,cx,cy)}" fill="none" stroke="{hl}" stroke-width="13" stroke-linecap="round" opacity=".9"/>'''
def svg(kind='dark'):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><defs>{bg(kind)}{GOLD}{drop(kind)}
<radialGradient id="glass" cx=".3" cy=".2" r="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".92"/><stop offset=".6" stop-color="#E6E9EE" stop-opacity=".62"/><stop offset="1" stop-color="#9FA5AF" stop-opacity=".55"/></radialGradient>
<clipPath id="g"><circle cx="388" cy="470" r="268"/></clipPath></defs>
<rect width="1024" height="1024" fill="url(#bg)"/>
<g filter="url(#drop)">{plate(388,470,268,'url(#iron)','url(#ironRim)','#FFFBE6',200,250,'a')}</g>
<g filter="url(#drop)">{plate(642,566,268,'url(#glass)','#FFFFFF','#FFFFFF',205,255,'b')}</g>
<circle cx="642" cy="566" r="268" fill="#F7C548" opacity=".22" clip-path="url(#g)"/>
<circle cx="642" cy="566" r="266" fill="none" stroke="#fff" stroke-width="4" opacity=".9"/>
</svg>'''
for k in ('dark','light'): open(f'c3-{k}.svg','w').write(svg(k))
