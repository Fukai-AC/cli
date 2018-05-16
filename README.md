![Logo of the project](./logo.png)

# fc-cli
> cli, nodejs

A tool used for React best practice

## Installing / Getting started

```shell
#Install
npm install fc-cli -g
# create a single page app
fcl i single *project name*
# create a composite page app
fcl i composite *project name*

# create component
fcl g component *component name*
# create route
fcl g route *route name*
```

## Configuration

### fcl generate(short-cut alias: 'g') [type] [name] [path]  

Generate route and component.  
[path]: default components path - src/components  
default route path - src/routes

#### Usage Examples

```bash
$ fcl g route product
$ fcl g component mycomponent
```
