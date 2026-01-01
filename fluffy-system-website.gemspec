# frozen_string_literal: true

Gem::Specification.new do |s|
  s.name          = "katies-website"
  s.version       = "0.0.0"
  s.license       = "CC0-1.0"
  s.authors       = ["Katie Hall", "Steve Smith", "GitHub, Inc."]
  s.email         = ["catmeow72@proton.me"]
  s.homepage      = "https://katiemau.complecwaft.com/"
  s.summary       = "Caitlyn's Website"

  s.files         = `git ls-files -z`.split("\x0").select do |f|
    f.match(%r{^((_includes|_layouts|_sass|assets)/|(LICENSE|README)((\.(txt|md|markdown)|$)))}i)
  end

  s.required_ruby_version = ">= 3.2.0"

  s.platform = Gem::Platform::RUBY
  s.add_runtime_dependency "jekyll", "~> 4.3.3"
  s.add_runtime_dependency "jekyll-seo-tag", "~> 2.8.0"
  s.add_runtime_dependency "csv", ">= 3.3"
  s.add_development_dependency "html-proofer", "~> 5.0"
  s.add_development_dependency "rubocop-github", "~> 0.26.0"
  s.add_development_dependency "w3c_validators", "~> 1.3"
end
