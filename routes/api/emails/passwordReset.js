const passwordReset = function(header, token) {
  return (
    '<div style="font-size:16px">' +
    'We\'re always forgetting our passwords too!' +
    '<br/>' +
    '<br/>' +
    'No worries - here\'s the link to change your password' +
    '<br/>' +
    '<br/>' +
    `<a href="http://${header}/reset/${token}/">Reset your password</a>` +
    '</div>'
  );
};

module.exports = passwordReset;
