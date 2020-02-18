
# Glossary

## Users

* `coder` : is the user who provides the stuff to create and export `blueprints` as an application. the stuff is called `backend`.
* `designer` : is the user who creates `blueprints` in the `blueprint-editor` with the `backend` provided by the `coder`.

## Glossary of designer

* `pad` : is your working folder with everything to create and export `blueprints`
  * `backend` files provided by the coder `designer`
  * `blueprint` files added by the `designer` via the `blueprint-editor`
* `ressource` : is a component of `backend` instanciable by the `designer` with the `toolbox`.
*  `toolbox` : contains every type of `node` like `ressources` and `blueprints`. 
* `blueprint` : is part of  `pad` created by the `designer` to define a graph the `toolbox` (see `node` and `link`). moreover `blueprints` can be nested (see `input-node` and `output-node`) 
* `node` : is a part of `blueprint` created by the `designer` to instanciate a `ressource` or another `blueprint`.
  * `input-node` : is a node that is represented as `input-field`  when you instanciate the `blueprint` in another one.
  * `output-node` : is a node that is represented as `output-field` when you instanciate the `blueprint` in another one.
* `field`: is a part of `node` and represent a property of `ressource` or `blueprint`.
  *  `input-field` : is a field with an input connector to able to `link` with `output-field`
  *  `output-field` : is a field with an output connector to able to `link` with `input-field`
  *  `form-field` : is a field can be setted with a constant.
  *  the field is polymo 
* `link` : is a part of `blueprint` created by the `designer`. It's able to connect an `output-field` with an `input-field`.


## Glossary of coder

* `backend` : is set of definitions published for the `designer`, and it is composed by a collection of `ressources` and `exports` and it can support many `targets` 
* `target`: is language/technology used by the `backend`. You can define  many `targets`. Accordingly for each `target` the coder have to define `bindings` and `export`  
* `ressource` : is a component (classes, function, module, ...) exposed by the `coder` with the `binding` and `inputs` and `outputs` definitions.
* `binding`: is informations needed to build the `ressource` by the `export`. The `binding` is defined for each `target`
* `factory`: is a `template` defined in the `export` that able to build a `ressource`. Therefore each `binding` of `ressources` references a `factory`.
* `package`: is a `binding` property to define where is your ressource like 'package' in java or 'module' python, 'namespace' in C# ...SO it's can used in `factory` `templates` as a prefix or in `main` `template` as import statement.
* `reference` : is a `binding` property to define the name of ressource in the `package`.
* `export` : ..
* `main`: is the `template` used to transform a `blueprint` in the `target` statements.
* `factories`: is collection of `factory` used by the `export`
* `template`: is a string written in ['nunjucks' syntax](https://mozilla.github.io/nunjucks/) 
 
