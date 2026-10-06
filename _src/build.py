# つかいかた： やすみのしゅくだい フォルダで  python _src/build.py
import io
s=io.open('_src/src.html',encoding='utf-8').read()
s=s.replace('/*__BOOKCSS__*/',io.open('_src/book.css',encoding='utf-8').read().strip()).replace('/*__PAGES__*/',io.open('_src/pages.js',encoding='utf-8').read())
io.open('index.html','w',encoding='utf-8',newline='\n').write(s)
print('built',len(s))
