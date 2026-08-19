import zipfile, xml.etree.ElementTree as ET, sys, collections
W='{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
ns={'w':W[1:-1]}
def inspect(path):
    z=zipfile.ZipFile(path)
    root=ET.fromstring(z.read('word/document.xml'))
    body=root.find('w:body',ns)
    L=[]
    heads=collections.Counter(); tables=0; bullets=0; mono=0; paras=0; codeparas=0
    tocfound=False; pagebreaks=0
    for el in body.iter():
        tag=el.tag.replace(W,'')
        if tag=='p':
            paras+=1
            pPr=el.find('w:pPr',ns)
            txt=''.join(t.text or '' for t in el.iter(W+'t'))
            if pPr is not None:
                ps=pPr.find('w:pStyle',ns)
                if ps is not None:
                    v=ps.get(W+'val')
                    if v and v.startswith('Heading'):
                        heads[v]+=1
                        L.append('%s | %s'%(v,txt[:80]))
                if pPr.find('w:numPr',ns) is not None: bullets+=1
            fonts=[r.get(W+'ascii') for r in el.iter(W+'rFonts')]
            if 'Consolas' in fonts:
                mono+=1
                if pPr is not None and pPr.find('w:shd',ns) is not None: codeparas+=1
        elif tag=='tbl':
            tables+=1
            grid=el.find('w:tblGrid',ns)
            gw=[int(g.get(W+'w')) for g in grid.findall('w:gridCol',ns)] if grid is not None else []
            tw=el.find('w:tblPr/w:tblW',ns)
            twv=int(tw.get(W+'w')) if tw is not None else None
            rows=el.findall('w:tr',ns)
            cellw=[]
            for r in rows[:1]:
                for c in r.findall('w:tc',ns):
                    x=c.find('w:tcPr/w:tcW',ns)
                    cellw.append(int(x.get(W+'w')) if x is not None else None)
            L.append('TABLE cols=%d rows=%d tblW=%s gridsum=%d cellsum=%s match=%s'%(
                len(gw),len(rows),twv,sum(gw),sum(x for x in cellw if x),
                'YES' if sum(gw)==twv and sum(x for x in cellw if x)==twv else 'NO'))
        elif tag=='br' and el.get(W+'type')=='page':
            pagebreaks+=1
    xmlraw=z.read('word/document.xml').decode('utf-8')
    tocfound='TOC \o' in xmlraw or 'TOC ' in xmlraw
    L.append('')
    L.append('SUMMARY: paragraphs=%d tables=%d bullets/numbered=%d monoParas=%d shadedCode=%d pageBreaks=%d TOCfield=%s'%(
        paras,tables,bullets,mono,codeparas,pagebreaks,tocfound))
    L.append('headings: %s'%dict(heads))
    return '\n'.join(L)
out=inspect(sys.argv[1] if len(sys.argv)>1 else '_smoke.docx')
open('_inspect_out.txt','w',encoding='utf-8').write(out)
