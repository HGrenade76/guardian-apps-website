import math
def pt(r,a,cx=512,cy=512): return cx+r*math.cos(math.radians(a)), cy+r*math.sin(math.radians(a))
def arc(r,a0,a1,cx=512,cy=512):
    x0,y0=pt(r,a0,cx,cy);x1,y1=pt(r,a1,cx,cy);large=1 if (a1-a0)%360>180 else 0
    return f'M{x0:.1f} {y0:.1f} A{r} {r} 0 {large} 1 {x1:.1f} {y1:.1f}'
BG={'dark':('#3B3D44','#15161A','#08080A'),'light':('#FFFFFF','#EFEFEB','#D7D7D1')}
def bg(kind):
    B=BG[kind];return f'<radialGradient id="bg" cx=".5" cy=".15" r="1.05"><stop offset="0" stop-color="{B[0]}"/><stop offset=".55" stop-color="{B[1]}"/><stop offset="1" stop-color="{B[2]}"/></radialGradient>'
GOLD='''<radialGradient id="iron" cx=".28" cy=".18" r="1.05"><stop offset="0" stop-color="#FFF4C9"/><stop offset=".22" stop-color="#F9D06A"/><stop offset=".55" stop-color="#D99A1E"/><stop offset=".85" stop-color="#93590A"/><stop offset="1" stop-color="#5E3804"/></radialGradient>
<linearGradient id="goldLin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFEFB2"/><stop offset=".35" stop-color="#F7C548"/><stop offset=".7" stop-color="#D08F15"/><stop offset="1" stop-color="#8E5608"/></linearGradient>
<linearGradient id="ironRim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF0B0"/><stop offset=".5" stop-color="#E3A22A"/><stop offset="1" stop-color="#7A4807"/></linearGradient>
<linearGradient id="steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".45" stop-color="#C3C7CE"/><stop offset="1" stop-color="#6B7079"/></linearGradient>
<linearGradient id="steelV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".5" stop-color="#BFC3CA"/><stop offset="1" stop-color="#7A7F88"/></linearGradient>'''
def drop(kind,op=None): return f'<filter id="drop" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="26" stdDeviation="30" flood-color="#000" flood-opacity="{op or (.6 if kind=="dark" else .26)}"/></filter>'
