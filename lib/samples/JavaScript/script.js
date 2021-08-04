
Parse.initialize('myAppId');
Parse.serverURL = 'http://localhost:1337/parse'

// ui helpers

const closeStep = (id) => {
  $(id).addClass('step--disabled');
}

const openStep  = (id) => {
  $(id).removeClass('step--disabled');
  $(id).removeClass('hidden');
}

const fillStepOutput  = (id, data) => {
  $(id).html('Output: ' + data).slideDown();
}

const showError = (e, step) => $(`#step-${step}-error`).html(e).slideDown();

const fillBtn  = (id, message) => {
  $(id).addClass('success').html('✓  ' + message);
}

const resolve = async (promise, step) => {
  if (!promise) {
    throw new Error("Please pass a promise.");
  }
  $('#loader').show();
  try {
    const result = await Promise.resolve(promise);
    $('#loader').hide();
    return result;
  } catch (e) {
    $('#loader').hide();
    showError(e, step);
    throw e;
  }
}

// helpers

if (Parse.User.current()) {
  fillStepOutput('#step-1-output', JSON.stringify(Parse.User.current().attributes));
  fillBtn('#step-1-btn', 'Signed up');
  openStep('#step-2');
}

$('#step-1-btn').click(async (e) => {
  e.preventDefault();
  if (Parse.User.current()) {
    console.log("ERR")
    showError('You are already logged in.', 1)
    return;
  }
  const user = new Parse.User();
  user.setUsername('username');
  user.setPassword('password');
  const acl = new Parse.ACL();
  user.setACL(acl);
  await resolve(user.signUp(), 1);
  fillStepOutput('#step-1-output', JSON.stringify(user.attributes));
  fillBtn('#step-1-btn', 'Signed up');
  openStep('#step-2');
});

$('#step-2-btn').click(async (e) => {
  e.preventDefault();
  const current = Parse.User.current();
  if (!current) {
    showError('Please login to continue.', 2);
    return;
  }
  const object = new Parse.Object('ToDo');
  object.set('user', current);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1)
  object.set('dueDate', tomorrow);
  object.set('task', 'Do the washing!');
  object.set('complete', false);

  const acl = new Parse.ACL(current);
  object.setACL(acl);

  await resolve(object.save(), 2);
  fillStepOutput('#step-2-output', JSON.stringify(object.attributes));
  fillBtn('#step-2-btn', 'Object saved');
  openStep('#step-3');
});

let objects = [];
const buildObjectUI  = () => {
  const formatDate = (date) => `${date.getHours() < 10 ? '0' : ''}${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`;
  const tableString = objects.map(obj => `<tr><td>${obj.id}</td><td>${obj.get('task')}</td><td>${formatDate(obj.get('dueDate'))}</td><td>${obj.get('complete')}</td><td><button type="button" onclick="setStatus('${obj.id}')">Click Me!</button></td></tr>`)
  fillStepOutput('#step-3-output', `<tr><th>id</th><th>task</th><th>dueDate</th><th>complete</th><th>Change Status</th></tr>${tableString.join('')}`);
  fillBtn('#step-3-btn', 'Objects found');
}

$('#step-3-btn').click(async (e) => {
  e.preventDefault();
  objects = await resolve(new Parse.Query('ToDo').find(), 3);
  buildObjectUI();
  openStep('#step-4');
});
const setStatus = async (id) => {
  let object;
  for (const obj of objects) {
    if (obj.id === id) {
      object = obj;
      break;
    }
  }
  if (!object) {
    showError(`Could not find object with id: ${id}`, 3)
    return;
  }
  object.set('complete',!object.get('complete'));
  await resolve(object.save(), 3);
  buildObjectUI();
}

const getUrl = () => {
  if (url) return url;
  var port = window.location.port;
  var url = window.location.protocol + '//' + window.location.hostname;
  if (port) url = url + ':' + port;
  return url;
}
const url = getUrl();
$('#parse-url').html(url + '/parse');