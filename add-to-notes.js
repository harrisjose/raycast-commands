#!/usr/bin/env node

// Required parameters:
// @raycast.schemaVersion 1
// @raycast.title Add note 
// @raycast.mode silent

// Optional parameters:
// @raycast.icon 💾
// @raycast.packageName Personal
// @raycast.argument1 { "type": "text", "placeholder": "URL" }
// @raycast.argument2 { "type": "text", "placeholder": "Excerpt"}

// Documentation:
// @raycast.description Adds custom url and text to notes in harrisjose.dev
// @raycast.author Harris
// @raycast.authorURL https://github.com/harrisjose
// 
import 'dotenv/config';
import ky from 'ky';

const API_URL = process.env.API_URL;
const RAYCAST_SCRIPT_TOKEN = process.env.RAYCAST_SCRIPT_TOKEN;

try {
  const [url, excerpt] = process.argv.slice(2)
  const response = await ky.post(`${API_URL}/${RAYCAST_SCRIPT_TOKEN}`, {
    json: {
      url: url,
      excerpt: excerpt,
    }
  }).json();
  console.log(response.message);
} catch (error) {
  console.error('Error', error);
}