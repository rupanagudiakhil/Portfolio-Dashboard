const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');
const JSZip = require('jszip');

const logos = [
  { name: 'Infosys', url: 'https://logo.clearbit.com/infosys.com' },
  { name: 'HDFC Bank', url: 'https://logo.clearbit.com/hdfcbank.com' },
  { name: 'Reliance Industries', url: 'https://logo.clearbit.com/ril.com' },
  { name: 'Tata Consultancy Services', url: 'https://logo.clearbit.com/tcs.com' },
  { name: 'ITC Limited', url: 'https://logo.clearbit.com/itcportal.com' },
  { name: 'Larsen & Toubro', url: 'https://logo.clearbit.com/larsentoubro.com' },
  { name: 'State Bank of India', url: 'https://logo.clearbit.com/onlinesbi.sbi' },
  { name: 'Maruti Suzuki', url: 'https://logo.clearbit.com/marutisuzuki.com' },
  { name: 'Bharti Airtel', url: 'https://logo.clearbit.com/airtel.in' },
  { name: 'Asian Paints', url: 'https://logo.clearbit.com/asianpaints.com' },
  { name: 'Wipro', url: 'https://logo.clearbit.com/wipro.com' },
  { name: 'Tata Steel', url: 'https://logo.clearbit.com/tatasteel.com' },
  { name: 'Tech Mahindra', url: 'https://logo.clearbit.com/techmahindra.com' },
  { name: 'Titan Company', url: 'https://logo.clearbit.com/titancompany.in' },
  { name: 'Adani Ports', url: 'https://logo.clearbit.com/adanienterprises.com' },
  { name:'TCS',url:'https://logo.clearbit.com/tcs.com'},
  { name:'ICICI BANK',url:'https://logo.clearbit.com/icicibank.com'},
  { name:'YES BANK',url:'https://logo.clearbit.com/yesbank.in'},
  { name:'TATA MOTORS',url:'https://logo.clearbit.com/tatamotors.com'},
  { name:'BRITANNIA',url:'https://logo.clearbit.com/britannia.com'},
  { name:'HINDUNILVR',url:'https://logo.clearbit.com/hul.co.in'},
  { name:'TATA POWER',url:'https://logo.clearbit.com/tatapower.com'},
  { name:'ADANI GREEN',url:'https://logo.clearbit.com/adanigreenenergy.com'},
  { name:'EICHERMOTORS',url:'https://logo.clearbit.com/eicher.in'},

];

const outputDir = path.resolve(__dirname, 'logos');
const zip = new JSZip();

async function downloadAndResize(name, url) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    const resizedBuffer = await sharp(buffer)
      .resize(128, 128)
      .png()
      .toBuffer();

    const filename = `${name.toLowerCase().replace(/\s+/g, '_')}.png`;
    fs.writeFileSync(path.join(outputDir, filename), resizedBuffer);

    zip.file(filename, resizedBuffer);
    console.log(`Downloaded and resized: ${name}`);
  } catch (error) {
    console.error(`Failed to process ${name}:`, error.message);
  }
}

async function main() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  for (const logo of logos) {
    await downloadAndResize(logo.name, logo.url);
  }

  const content = await zip.generateAsync({ type: 'nodebuffer' });
  fs.writeFileSync(path.join(outputDir, 'all_logos.zip'), content);

  console.log('All logos downloaded, resized, and zipped successfully!');
}

main();