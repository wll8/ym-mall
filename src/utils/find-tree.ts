export function findNodeById(tree, id, config = { labelKey: 'value' }) {
  // 遍历树中的每个节点
  for (const node of tree) {
    // 如果当前节点的ID匹配目标ID，则返回当前节点
    if (node[config.labelKey] === id) {
      return node
    }
    // 如果当前节点有子节点，则递归地在子节点中查找
    if (node.children && node.children.length > 0) {
      const foundNode = findNodeById(node.children, id, config)
      if (foundNode) {
        return foundNode
      }
    }
  }
  // 如果没有找到匹配的节点，则返回null
  return null
}
