import 'dotenv/config';

import app from './app.js'
import connectDB from './config/db.js'

const PORT = process.env.PORT || 5000;
connectDB()
.then(()=>{
    const server = app.listen(PORT,()=>{
        console.log(`Server running on ${PORT}`)
    })
    // server.on not app.on bcz app is typed as express application
    // express application does not expose genric error like nodejs server does
    server.on("error",(error)=>{
        console.log('ERR',error)
    })
})
.catch((err:unknown)=>{
    console.log("MongoDb connection failed");
    process.exit(1);
})


// import 'dotenv/config';

// import app from './app.js';
// import connectDB from './config/db.js';

// const PORT = Number(process.env.PORT) || 5000;

// connectDB()
//   .then(() => {
//     const server = app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });

//     server.on("error", (error) => {
//       console.error("Server error:", error);
//     });
//   })
//   .catch((err: unknown) => {
//     console.error("MongoDB connection failed:", err);
//     process.exit(1);
//   });
