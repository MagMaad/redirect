import fs from 'fs';
import yaml from 'js-yaml';
import express, {
    Request,
    Response,
    NextFunction
} from 'express';

const config = yaml.load(fs.readFileSync('./config.yml', 'utf-8')) as any;

const app = express();
const port = config.port;

app.use(log);

interface Redirect {
    src: string
    dest: string
}

function log(req: Request, res: Response, next: NextFunction) {
    const ip = req.headers['x-forwarded-for'];
    const slug = req.originalUrl;

    console.log(`${ip} requested ${slug}`);

    next();
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
