#!/usr/bin/env node

// Required parameters:
// @raycast.schemaVersion 1
// @raycast.title Save to notes
// @raycast.mode silent

// Optional parameters:
// @raycast.icon 💾
// @raycast.packageName Personal

// Documentation:
// @raycast.description Adds the current selection and url to notes in harrisjose.dev
// @raycast.author Harris
// @raycast.authorURL https://github.com/harrisjose
// 
import 'dotenv/config';
import ky from 'ky';
import { getActiveTab } from './lib/get-active-tab.js';

const API_URL = process.env.API_URL;
const RAYCAST_SCRIPT_TOKEN = process.env.RAYCAST_SCRIPT_TOKEN;

try {
  const info = await getActiveTab();
  console.log(info);
  const response = await ky.post(`${API_URL}/${RAYCAST_SCRIPT_TOKEN}`, {
    json: {
      url: info.url,
      excerpt: info.excerpt,
    }
  }).json();
  console.log(response.message);
} catch (error) {
  console.error('Error', error);
}