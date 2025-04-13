import yaml from 'js-yaml'
import fs from 'fs'

const imagesToSkip = ['tailscale/tailscale', 'nginx']
const UNDEFINED_PORT = -1;

export function parse(composePath){
    if (!fs.existsSync(composePath)) {
        throw new Error(`Cannot locate YAML file at ${composePath}.`)
    }

    const yamlContents = yaml.load(fs.readFileSync(`${composePath}`))
    return createDescriptors(yamlContents)
}

function createDescriptors(composeYaml) {
    let descriptorArr = []

    for (let service in composeYaml.services) {
        let port = UNDEFINED_PORT
        let composePort = composeYaml.services[service].port
        let imageName = removeVersionTag(composeYaml.services[service].image)

        if (composePort) {
            port = composePort
        }

        if (checkIfSkippableImage(imageName)) {
            continue
        }

        descriptorArr.push(
            new ServiceDescriptor(
                service,
                imageName,
                port))
    }

    return descriptorArr
}

function checkIfSkippableImage(imageName) {
    return imagesToSkip.includes(imageName)
}

function removeVersionTag(image) {
    return image.split(':')[0]
}

class ServiceDescriptor {
    constructor(name, image, port) {
        this.name = name
        this.image = image
        this.port = port
    }
}