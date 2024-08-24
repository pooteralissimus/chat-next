/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
      remotePatterns: [
         {
            protocol: 'https',
            hostname: 'tests-spaces.nyc3.digitaloceanspaces.com',
            pathname: '/**',
         },
      ],
   },
   reactStrictMode: true,
   api: {
      bodyParser: false,
   },
}

export default nextConfig
