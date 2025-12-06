// 生成随机整数 [min, max]
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

export const generateProblem = (type, range) => {
  // 解析 range
  let max = 10
  if (range === 'random') {
    max = randomInt(10, 100) // 随机范围默认为 100 以内
  } else {
    max = parseInt(range)
  }

  // 决定是加法还是减法
  // 如果 type 是 'add_sub'，则随机。如果是 'multiply' 等待后续实现。
  const isAddition = Math.random() > 0.5
  
  let num1, num2, result, operator
  
  if (isAddition) {
    // 加法: num1 + num2 = result
    // 限制 result <= max
    result = randomInt(2, max)
    num1 = randomInt(0, result)
    num2 = result - num1
    operator = '+'
  } else {
    // 减法: num1 - num2 = result
    // 限制 num1 <= max
    num1 = randomInt(1, max)
    num2 = randomInt(0, num1)
    result = num1 - num2
    operator = '-'
  }

  // 决定填空位置 (0: num1, 1: num2, 2: result)
  // 简单起见，主要做结果填空，但也支持中间填空
  // 权重：结果填空 50%，中间填空 50%
  const blankIndex = Math.random() > 0.5 ? 2 : (Math.random() > 0.5 ? 0 : 1)

  // 格式化题目结构
  // 我们统一转换为: leftOp operator rightOp = answer
  // 例如 3 + 2 = 5
  // 或者 5 - 2 = 3
  
  return {
    num1,
    num2,
    result,
    operator,
    blankIndex, // 0, 1, or 2
    id: Date.now()
  }
}

export const getRandomEmoji = () => {
  const emojis = ['🍎', '🍌', '🍇', '🍊', '🍓', '🐶', '🐱', '🐰', '🐼', '🐻', '🚗', '🚀', '⚽️', '🏀', '⭐️', '🎈']
  return emojis[Math.floor(Math.random() * emojis.length)]
}
