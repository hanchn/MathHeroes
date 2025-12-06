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

// 生成混合运算 (A op1 B op2 C = ?)
export const generateComplexProblem = (range) => {
  let max = 10
  if (range !== 'random') {
    max = parseInt(range)
  } else {
    max = 20
  }

  // 操作符池
  const ops = ['+', '-']
  // 暂时只做加减混合，避免乘除优先级问题导致太难，除非专门设计
  // 如果要做乘除，需要处理优先级和括号。
  // 简单的 A +/- B +/- C
  
  const op1 = ops[Math.floor(Math.random() * ops.length)]
  const op2 = ops[Math.floor(Math.random() * ops.length)]
  
  let num1, num2, num3, result
  
  // 简单的生成策略：步步为营，保证每一步结果非负且不超过范围（可选）
  // Step 1: A op1 B = temp
  // Step 2: temp op2 C = result
  
  let temp
  let isValid = false
  
  while (!isValid) {
    num1 = randomInt(1, max)
    num2 = randomInt(1, max)
    num3 = randomInt(1, max)
    
    // 计算第一步
    if (op1 === '+') temp = num1 + num2
    else temp = num1 - num2
    
    // 检查第一步是否合法 (非负)
    if (temp < 0) continue
    
    // 计算第二步
    if (op2 === '+') result = temp + num3
    else result = temp - num3
    
    // 检查最终结果是否合法 (非负，且不超过稍微大一点的范围以免太难)
    if (result < 0 || result > max * 2) continue
    
    isValid = true
  }

  return {
    type: 'complex',
    num1,
    num2,
    num3,
    operator1: op1,
    operator2: op2,
    result,
    blankIndex: 3, // 默认结果填空
    id: Date.now()
  }
}

export const getRandomEmoji = () => {
  const emojis = ['🍎', '🍌', '🍇', '🍊', '🍓', '🐶', '🐱', '🐰', '🐼', '🐻', '🚗', '🚀', '⚽️', '🏀', '⭐️', '🎈']
  return emojis[Math.floor(Math.random() * emojis.length)]
}
