# Use

```js
a = markdownit().use(markdown_it_input_plugin);
output.innerHTML=a.render(`# this is some markdown
now this is an inline input %input text fart fart% right there
\`\`\`
this is the code that produced that:
# this is some markdown
now this is an inline input %input text fart fart% right there
\`\`\`
`); 
```
