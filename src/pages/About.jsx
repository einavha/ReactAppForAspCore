import { Container, Typography, Box, Paper } from '@mui/material';
import { SiteName, TextAlignment } from '../config/site.jsx';

function About() {
    return (
        <Container maxWidth="lg" style={{ textAlign: TextAlignment }}>
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    About {SiteName}
                </Typography>
                <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        A fresh take on men's fashion and style
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Adon is a magazine that takes a fresh look at fashion and style for men.
                        It will take an honorary place in your list of favorite men's fashion magazines.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Every issue gives you insight into every aspect of the modern "it" boy's life.
                        On the pages of our print & online magazine for men you will learn everything
                        about big city life: fashion, pop culture news, artistic projects with celebrities
                        and your everyday fitness tips. See all the benefits of urban men's fashion from
                        a new perspective in this magazine.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        The first issue of this men's lifestyle magazine was published in December 2012.
                        Bold looks created by the best designers and photographers especially for Adon
                        instantly caught the attention of stylish, extraordinary men from every corner of the globe.
                        Our magazine was recognized as one of the top men's fashion magazines, and yes, it makes us proud!
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Adon is not just any men's fashion magazine - from the very first page you will be pulled
                        into a colorful flurry of pop culture, fashion, and art. With the help of creative young authors,
                        photographers, and designers from every part of the globe, you will be the first to know what the fashion
                        world of tomorrow is going to look like. This is a completely new type of men's lifestyle magazine.
                        We know how to help you find your own style in the hustle and bustle of the big city. The secrets of male
                        attractiveness are revealed in creative photo stories composed by famous designers, male models, and photographers.
                        If you don't want to miss a single detail, purchase the new issue in the online Adon shop and enjoy exclusive
                        materials from the best authors!
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Worldwide celebrities and the hottest male models assume completely unexpected personalities on the pages of Adon:
                        stylish playboys, powerful sportsmen, and fabulous macho, handsome devils. We look for the most topical matters to make
                        sure you devour every single page. If you are sick and tired of boring looks in classic men's fashion magazines,
                        have no doubt - Adon is just what you need!
                    </Typography>
                    <Typography variant="body1" paragraph>
                        New issues of Adon come out every two months. This is your year-round fashion guide - you are always prepared.
                        We will tell you about the latest trends in the world of men's fashion and about bright, creative people that make up this world.
                        You will learn about the latest art projects and life of "it" boys in New York.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Order an online subscription to Adon men's fashion magazine, and you are guaranteed to always be on top of the latest trends
                        in style &amp; pop culture. Or you can order printed issues of the men's magazine through our website, and we will make sure to deliver
                        the newest issue to you as quickly as possible.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Now Adon is also available on your mobile gadget! Read the best magazine for men online right from your iPad or iPhone.
                        Download the Adon app on iTunes to get your new issue now. Feel free to browse previous issues of our fashion magazine for men
                        online on your smartphone. Subscribe to Adon men's magazine right now to see what we have in store for you.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Adon is available by mail order, magazine stores, online, and the new mobile app.
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
}

export default About;
