// Load environment variables natively if supported
try {
    if (typeof process.loadEnvFile === 'function') {
        process.loadEnvFile();
    }
} catch (err) {
    // Ignore
}

export const config = {
    theresav: process.env.THERESAV_API_KEY,
    zpi: process.env.ZPI_API_KEY,
};

