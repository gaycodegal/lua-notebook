require("./templater")
local dark = dofile("dark.lua")
local light = dofile("light.lua")

function to_color(dict, color)
	 if string.find(color, "#") == 1 then
			color = color:gsub( '#', '' )
			if #color == 3 then
				 local r = color:sub(1,1)
				 local g = color:sub(2,2)
				 local b = color:sub(3,3)
				 return {tonumber("0x"..r..r),
								 tonumber("0x"..g..g),
								 tonumber("0x"..b..b)}
			elseif #color == 6 then
				 return {tonumber("0x"..color:sub(1,2)),
								 tonumber("0x"..color:sub(3,4)),
								 tonumber("0x"..color:sub(5,6))}
			end
			return nil
	 elseif string.find(color, "%-%-") == 1 then
			return dict[color]
	 end
end

local RED = 0.2126
local GREEN = 0.7152
local BLUE = 0.0722

local GAMMA = 2.4

function luminanceV(c)
	 local v = c/255
	 if v <= 0.03928 then
			return v / 12.92
	 else
			return ((v + 0.055) / 1.055) ^ GAMMA;
	 end
end

function luminance(r, g, b)
	 return luminanceV(r) * RED + luminanceV(g) * GREEN + luminanceV(b) * BLUE;
end

function contrast_of(c1, c2)
	 local lum1 = luminance(table.unpack(c1))
	 local lum2 = luminance(table.unpack(c2))
	 local brightest = math.max(lum1, lum2)
	 local darkest = math.min(lum1, lum2)
	 return (brightest + 0.05) / (darkest + 0.05)
end

function create_dict(colors)
	 
	 local dict = {}
	 for i,color in ipairs(colors) do
			local value = to_color(dict, color[2])
			dict[color[1]] = value
	 end
	 
	 return dict
end

function is_contrast_good(c1, c2)
	 return c1 ~= nil and c2 ~= nil and contrast_of(c1,c2) >= 4.5
end

function check_colors(name, colors)
	 local dict = create_dict(colors)
	 local checked = {}
	 local full_check = true
	 for key, color in pairs(dict) do
			if not checked[key] then
				 local color_kind = key:sub(#key-2, #key)
				 local other = nil
				 if color_kind == "-fg" then
						other = key:sub(1, #key-3).."-bg"
				 elseif color_kind == "-bg" then
						other = key:sub(1, #key-3).."-fg"
				 end
				 if other ~= nil then
						local check = is_contrast_good(color, dict[other])
						full_check = full_check and check
						if not check then
							 print(key, other, check)
							 if dict[other] == nil or color == nil then
									print("nil color")
							 else
									print(color, dict[other], contrast_of(color, dict[other]))
							 end
						end
						checked[key] = true
						checked[other] = true
				 end
			end
	 end

	 if full_check then
			print("pass", name)
	 else
			print("fail", name)
	 end
	 return full_check
end


local dark_pass = check_colors("dark", dark)
local light_pass = check_colors("light", light)

function convert_to_css(colors)
	 local css = {}
	 for i,color in ipairs(colors) do
			local values = {color[1], ": ", color[2], ";"}
			if string.find(color[2], "%-%-") == 1 then
				 values[3] = "var("..color[2]..")"
			end
			css[#css + 1] = table.concat(values)
	 end
	 return table.concat(css, "\n\t\t")
end
local args = {
	 dark = convert_to_css(dark),
	 light = convert_to_css(light),
}

if dark_pass and light_pass then
	 replaceFile("./colors.template.css", "../colors.css", args)
end
