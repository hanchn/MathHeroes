const cnNums = {
  '零': 0, '0': 0,
  '一': 1, '壹': 1, '1': 1,
  '二': 2, '贰': 2, '两': 2, '2': 2,
  '三': 3, '叁': 3, '3': 3,
  '四': 4, '肆': 4, '4': 4,
  '五': 5, '伍': 5, '5': 5,
  '六': 6, '陆': 6, '6': 6,
  '七': 7, '柒': 7, '7': 7,
  '八': 8, '捌': 8, '8': 8,
  '九': 9, '玖': 9, '9': 9,
  '十': 10, '拾': 10
}

export const parseVoiceInput = (text) => {
  if (!text) return null
  
  // 预处理：如果包含“等于”或“是”，只取后面的部分
  let processText = text
  if (text.includes('等于')) {
    processText = text.split('等于')[1]
  } else if (text.includes('是')) {
    processText = text.split('是')[1]
  }

  // 1. 尝试直接匹配阿拉伯数字
  const match = processText.match(/\d+/)
  if (match) return parseInt(match[0])

  // 2. 尝试中文数字转换
  // 移除无关字符
  let cleanText = processText.replace(/[^\u4e00-\u9fa5\d]/g, '')
  
  // 简单映射单字
  if (cnNums[cleanText] !== undefined) return cnNums[cleanText]

  // 处理 "十一", "二十五" 等
  if (cleanText.includes('十')) {
    const parts = cleanText.split('十')
    const left = parts[0] // 十前面的
    const right = parts[1] // 十后面的
    
    let numLeft = 1 // 默认为1 (例如 "十" = 1*10)
    if (left && cnNums[left] !== undefined) {
      numLeft = cnNums[left]
    }
    
    let numRight = 0
    if (right && cnNums[right] !== undefined) {
      numRight = cnNums[right]
    }
    
    return numLeft * 10 + numRight
  }
  
  // 最后的兜底：反向查找最后一个匹配的数字
  // 例如 "三加三等于六" -> cleanText可能是 "三三六"
  // 我们从后往前找
  for (let i = cleanText.length - 1; i >= 0; i--) {
    const char = cleanText[i]
    if (cnNums[char] !== undefined) {
      return cnNums[char]
    }
  }

  return null
}
