var cp = require('child_process');
  
function getBranch() {
  var branch;
  try {
    branch = cp.execSync('git symbolic-ref --short -q HEAD').toString().trim();
  } catch(e) {
    console.error('error:', e);
  }
  
  return branch;
}

function getLastCommit() {
  var commit;
  try {
    commit = cp.execSync('git rev-parse HEAD').toString().trim();
  } catch(e) {
    console.error('error:', e);
  }
  
  return commit;
}

function isStatusClean() {
  var isClean;
  try {
    isClean = cp.execSync('git status -s').toString().trim() === '';
  } catch(e) {
    console.error('error:', e);
  }
  
  return isClean;
}

function getUser() {
  var user = {
    name: 'cibot',
    email: 'cibot@uxsino.com'
  }
  try {
    user.name = cp.execSync('git config --get user.name').toString().trim();
    user.email = cp.execSync('git config --get user.email').toString().trim();
  } catch(e) {
    console.error('error:', e);
  }
  
  return user;
}

exports.getBranch = getBranch;
exports.getLastCommit = getLastCommit;
exports.isStatusClean = isStatusClean;
exports.getUser = getUser;