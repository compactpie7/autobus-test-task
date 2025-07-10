## Usage
To use my project you need to write in console
```
npm i

npm run build

npm run server
```

then you need to open 
```index.html```
(live server recommended)

In dev mode you can run ```npm run watch``` and changes you do to .ts files would automatically recompile in your dist folder



## Server part

I've used just simple db.json because this project is should be simple and i didn't had much time, so the security of this app is on the ground.

## Client part

For the reason that I had to write in vanilla TypeScript, the readability of the code is obviously worse than when writing code in Next.js/React. However, I tried to make the code concise, complex logic, repetitive elements and css were separated into separate components, this allows to unload the code and make it more understandable
