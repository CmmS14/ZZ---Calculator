# Calculator App
<ul>
  <li>I'm trying to learn javascript So I made this.</li>
  <li>Feel free to use it.</li>
  <li>Negative numbers doesn't work.</li>
</ul>
------------------------------
<br/>
If you want to add enter key to findresult, you can add this to script.js:
<br/>
<code>
equation.addEventListener('keyup', function (e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    findResult();
  }
});
</code>
