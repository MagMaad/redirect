import fs from 'fs';
import yaml from 'js-yaml';
import express from 'express';

const config = yaml.load(fs.readFileSync('./config.yml', 'utf-8')) as any;

const app = express();
const port = config.port;

interface Redirect {
    src: string
    dest: string
}

config.redirects.forEach((redirect: Redirect) => {
    app.get(redirect.src, (req, res) => {
        return res.redirect(redirect.dest);
    });
});

app.get('*', (req, res) => {
    return res.redirect('https://github.com/MagMaad/redirect');
});

app.listen(port, () => {
    console.log(`Redirect server started on port ${port}`);
});
