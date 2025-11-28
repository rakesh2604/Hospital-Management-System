const fs = require('fs');
const path = require('path');

const structure = {
  'server': {
    'src': {
      'modules': {
        'auth': {},
        'patients': {},
        'vitals': {}
      },
      'config': {},
      'middleware': {}
    }
  },
  'client': {}
};

function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✓ Created: ${dirPath}`);
  } else {
    console.log(`⊘ Exists: ${dirPath}`);
  }
}

function createStructure(basePath, structure) {
  for (const [name, children] of Object.entries(structure)) {
    const dirPath = path.join(basePath, name);
    createDirectory(dirPath);
    
    if (Object.keys(children).length > 0) {
      createStructure(dirPath, children);
    }
  }
}

const rootPath = process.cwd();
console.log('Generating Modular Monolith MERN structure...\n');
createStructure(rootPath, structure);
console.log('\n✓ Folder structure created successfully!');

