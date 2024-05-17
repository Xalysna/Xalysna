const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream, readdir, stat, unlink, writeFile } = require('fs');
const { promisify } = require('util');
const path = require('path');

const readdirAsync = promisify(readdir);
const statAsync = promisify(stat);
const unlinkAsync = promisify(unlink);
const writeFileAsync = promisify(writeFile);

const rootPath = 'C:/Users/kevin/public';
const sitemapStream = new SitemapStream({
    hostname: 'https://www.xalysna.com',
    xslUrl: 'https://www.xalysna.com/sitemap.xsl'
});
const writeStream = createWriteStream(path.join(rootPath, 'sitemap.xml'));

const directories = [
    '/',
    '/content/About',
    '/content/blog/xalysna-blog/xalysna-blog-files',
    '/content/privacy',
    '/content/support',
    '/content/token',
    '/content/Utilities',
    '/content/donate',
];

const excludedPaths = [
    path.join(rootPath, 'dashboard/auth/action').toLowerCase(),
    path.join(rootPath, 'dashboard/auth').toLowerCase(),
    path.join(rootPath, 'dashboard/users').toLowerCase(),
    path.join(rootPath, 'dashboard/auth/create-account.html').toLowerCase(),
    path.join(rootPath, 'assets/dist/settings/config/firebase-interface-config.html').toLowerCase(),
    path.join(rootPath, 'content/blog/xalysna-blog/xalysna-blog-files/404.html').toLowerCase(),
    path.join(rootPath, 'content/blog/xalysna-blog/preview').toLowerCase(),
    path.join(rootPath, 'content/blog/xalysna-blog/output').toLowerCase(),
    path.join(rootPath, '404.html').toLowerCase(),
    path.join(rootPath, 'construction.html').toLowerCase()
];

async function walkDirectory(directory) {
    const fullPath = path.join(rootPath, directory);
    const files = await readdirAsync(fullPath);

    for (const file of files) {
        const filePath = path.join(fullPath, file);
        const filePathLower = filePath.toLowerCase();

        if (excludedPaths.some(excludedPath => filePathLower.startsWith(excludedPath))) {
            continue;
        }

        const fileStats = await statAsync(filePath);
        if (fileStats.isDirectory()) {
            await walkDirectory(path.join(directory, file));
        } else if (file.endsWith('.html')) {
            let priority = 0.5;
            if (filePath.includes('index.html')) {
                priority = directory === '/' ? 1.0 : directory.includes('/blog') ? 0.9 : priority;
            }
            const urlPath = path.join(directory, file).replace(/\\/g, '/');
            sitemapStream.write({
                url: `https://www.xalysna.com${urlPath}`,
                changefreq: 'daily',
                priority: priority,
                lastmodISO: fileStats.mtime.toISOString()
            });
        }
    }
}

async function deleteRobotsTxt() {
    const robotsPath = path.join(rootPath, 'content/blog/xalysna-blog/xalysna-blog-files', 'robots.txt');
    await unlinkAsync(robotsPath).catch(error => console.error("Failed to delete robots.txt:", error));
}

async function createRobotsTxt() {
    const robotsContent = `User-agent: *\nDisallow:\nSitemap: https://www.xalysna.com/sitemap.xml`;
    await writeFileAsync(path.join(rootPath, 'robots.txt'), robotsContent)
        .catch(error => console.error("Failed to create robots.txt:", error));
}

async function generateSitemap() {
    await deleteRobotsTxt();
    await createRobotsTxt();
    await Promise.all(directories.map(directory => walkDirectory(directory)));
    sitemapStream.end();
}

sitemapStream.pipe(writeStream)
    .on('finish', () => console.log('Sitemap and robots.txt created successfully.'))
    .on('error', (error) => console.error('Error writing sitemap:', error));

generateSitemap().catch(error => console.error('Error generating the sitemap:', error));
