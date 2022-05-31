const express = require("express")
const colors = require("colors")
const path = require("path")
require("dotenv").config({ path: "./.env" })

const app = express()

const connectDB = require("./api/config/db")

// Connect to database
connectDB()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Mounting routes
app.use("/api/v1/users", require("./src/routes/user.route"))

const server = app.listen(process.env.PORT || 3000, console.log(`Server running on port ${process.env.PORT || 3000}`.green.bold))

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.red)
    server.close(() => process.exit(1))
})