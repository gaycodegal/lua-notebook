function replaceFile(template_fname, output_fname, args)
	 local template_file = io.open(template_fname, 'r')
	 local template = template_file:read("*all")
	 template_file:close()
	 print("read", template_fname)
	 
	 function replacer(x)
			return args[x] or ''
	 end
	 local result = string.gsub(template, "{{(%g*)}}", replacer)
	 
	 local output_file = io.open(output_fname, 'w')
	 output_file:write(result)
	 output_file:close()
	 print("output", output_fname)

end
