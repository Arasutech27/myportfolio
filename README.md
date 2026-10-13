# M. Arasu — Portfolio (Static Site)

A self-contained static site: `index.html`, `css/style.css`, `js/script.js`, `images/profile.jpg`.
No build step, no dependencies to install — upload the files as-is.

## Deploy to AWS S3 (static website hosting)

1. **Create a bucket**
   - S3 console → Create bucket → give it a globally unique name (e.g. `arasu-portfolio`) → uncheck "Block all public access" (needed for a public website) → Create.

2. **Upload the files**
   - Open the bucket → Upload → add `index.html`, and the `css/`, `js/`, `images/` folders (keep the folder structure).

3. **Enable static website hosting**
   - Bucket → Properties → Static website hosting → Enable.
   - Index document: `index.html`
   - Error document: `index.html` (optional, keeps deep links working)
   - Save. Note the **bucket website endpoint** shown here — that's your live URL.

4. **Make the files public**
   - Bucket → Permissions → Bucket Policy → add a policy like:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [{
       "Sid": "PublicReadGetObject",
       "Effect": "Allow",
       "Principal": "*",
       "Action": "s3:GetObject",
       "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
     }]
   }
   ```
   Replace `YOUR-BUCKET-NAME` with your actual bucket name.

5. **Visit your site**
   - Use the endpoint from step 3, e.g. `http://arasu-portfolio.s3-website-ap-south-1.amazonaws.com`

## Optional: custom domain + HTTPS
Put the bucket behind **CloudFront** (with an ACM certificate) and point your domain's DNS (Route 53 or elsewhere) at the CloudFront distribution. This also gives you HTTPS, which plain S3 website hosting doesn't provide on its own.

## Editing content
All text lives directly in `index.html` — search for the section you want (About, Skills, Experience, Projects, Education, Contact) and edit in place. Colors and spacing are in `css/style.css` under `:root` at the top.
