const sheetsData = 
  {
    name: 'Essentials of DSA - Leetcode',
    slug : 'essentials-of-dsa-leetcode',
    categories: [
      {
        name: 'Arrays',
        slug : 'arrays',
                problems: [
          { title: 'Two Sum', slug: 'two-sum' },
          { title: '3Sum', slug: '3sum' },
          { title: 'Trapping Rain Water', slug: 'trapping-rain-water' },
          { title: 'Maximum Subarray', slug: 'maximum-subarray' },
          { title: 'Spiral Matrix', slug: 'spiral-matrix' },
          {
            title: 'Best Time to Buy and Sell Stock',
            slug: 'best-time-to-buy-and-sell-stock'
          },
          { title: 'Contains Duplicate', slug: 'contains-duplicate' },
          {
            title: 'Product of Array Except Self',
            slug: 'product-of-array-except-self'
          }
        ]
      },
      {
        name: 'Strings',
        slug : 'strings',
        problems: [
          {
            title: 'Longest Substring Without Repeating Characters',
            slug: 'longest-substring-without-repeating-characters'
          },
          {
            title: 'Longest Palindromic Substring',
            slug: 'longest-palindromic-substring'
          },
          {
            title: 'Longest Common Prefix',
            slug: 'longest-common-prefix'
          },
          { title: 'Group Anagrams', slug: 'group-anagrams' },
          { title: 'Valid Palindrome', slug: 'valid-palindrome' },
          {
            title: 'Palindromic Substrings',
            slug: 'palindromic-substrings'
          }
        ]
      },
      {
        name: 'Linked Lists',
        slug : 'linked-lists',
        problems: [
          {
            title: 'Remove Nth Node From End of List',
            slug: 'remove-nth-node-from-end-of-list'
          },
          {
            title: 'Merge Two Sorted Lists',
            slug: 'merge-two-sorted-lists'
          },
          {
            title: 'Merge k Sorted Lists',
            slug: 'merge-k-sorted-lists'
          },
          {
            title: 'Reverse Nodes in k-Group',
            slug: 'reverse-nodes-in-k-group'
          },
          { title: 'Linked List Cycle', slug: 'linked-list-cycle' },
          { title: 'Reorder List', slug: 'reorder-list' },
          { title: 'Reverse Linked List', slug: 'reverse-linked-list' }
        ]
      },
      {
        name: 'Stacks & Queues',
        slug : 'stacks-queues',
        problems: [
          { title: 'Valid Parentheses', slug: 'valid-parentheses' },
          {
            title: 'Largest Rectangle in Histogram',
            slug: 'largest-rectangle-in-histogram'
          },
          { title: 'Min Stack', slug: 'min-stack' },
          {
            title: 'Implement Queue using Stacks',
            slug: 'implement-queue-using-stacks'
          },
          {
            title: 'Sliding Window Maximum',
            slug: 'sliding-window-maximum'
          },
          {
            title: 'Next Greater Element I',
            slug: 'next-greater-element-i'
          },
          { title: 'Daily Temperatures', slug: 'daily-temperatures' }
        ]
      },
      {
        name: 'Trees',
        slug : 'trees',
        problems: [
          {
            title: 'Binary Tree Level Order Traversal',
            slug: 'binary-tree-level-order-traversal'
          },
          {
            title: 'Maximum Depth of Binary Tree',
            slug: 'maximum-depth-of-binary-tree'
          },
          {
            title: 'Construct Binary Tree from Preorder and Inorder Traversal',
            slug: 'construct-binary-tree-from-preorder-and-inorder-traversal'
          },
          {
            title: 'Binary Tree Maximum Path Sum',
            slug: 'binary-tree-maximum-path-sum'
          },
          { title: 'Invert Binary Tree', slug: 'invert-binary-tree' },
          {
            title: 'Lowest Common Ancestor of a Binary Search Tree',
            slug: 'lowest-common-ancestor-of-a-binary-search-tree'
          },
          {
            title: 'Serialize and Deserialize Binary Tree',
            slug: 'serialize-and-deserialize-binary-tree'
          }
        ]
      },
      {
        name: 'Graphs',
        slug : 'graphs',
        problems: [
          { title: 'Word Ladder', slug: 'word-ladder' },
          { title: 'Number of Islands', slug: 'number-of-islands' },
          { title: 'Course Schedule', slug: 'course-schedule' },
          { title: 'Alien Dictionary', slug: 'alien-dictionary' },
          {
            title: 'Pacific Atlantic Water Flow',
            slug: 'pacific-atlantic-water-flow'
          },
          { title: 'Flood Fill', slug: 'flood-fill' },
          { title: 'Network Delay Time', slug: 'network-delay-time' }
        ]
      },
      {
        name: 'Dynamic Programming',
        slug : 'dynamic-programming',
        problems: [
          {
            title: 'Regular Expression Matching',
            slug: 'regular-expression-matching'
          },
          { title: 'Climbing Stairs', slug: 'climbing-stairs' },
          { title: 'Edit Distance', slug: 'edit-distance' },
          { title: 'House Robber', slug: 'house-robber' },
          {
            title: 'Longest Increasing Subsequence',
            slug: 'longest-increasing-subsequence'
          },
          { title: 'Coin Change', slug: 'coin-change' },
          {
            title: 'Partition Equal Subset Sum',
            slug: 'partition-equal-subset-sum'
          }
        ]
      },
      {
        name: 'Greedy Algorithms',
        slug : 'greedy-algorithms',
        problems: [
          { title: 'Jump Game', slug: 'jump-game' },
          { title: 'Candy', slug: 'candy' },
          {
            title: 'Minimum Number of Arrows to Burst Balloons',
            slug: 'minimum-number-of-arrows-to-burst-balloons'
          },
          { title: 'Assign Cookies', slug: 'assign-cookies' },
          { title: 'Partition Labels', slug: 'partition-labels' }
        ]
      },
      {
        name: 'Backtracking',
        slug : 'backtracking',
        problems: [
          {
            title: 'Letter Combinations of a Phone Number',
            slug: 'letter-combinations-of-a-phone-number'
          },
          {
            title: 'Generate Parentheses',
            slug: 'generate-parentheses'
          },
          { title: 'Combination Sum', slug: 'combination-sum' },
          { title: 'Permutations', slug: 'permutations' },
          { title: 'N-Queens', slug: 'n-queens' },
          { title: 'Word Search', slug: 'word-search' }
        ]
      },
      {
        name: 'Bit Manipulation',
        slug : 'bit-manipulation',
        problems: [
          { title: 'Subsets', slug: 'subsets' },
          { title: 'Single Number', slug: 'single-number' },
          { title: 'Number of 1 Bits', slug: 'number-of-1-bits' },
          {
            title: 'Maximum XOR of Two Numbers in an Array',
            slug: 'maximum-xor-of-two-numbers-in-an-array'
          },
          { title: 'Hamming Distance', slug: 'hamming-distance' }
        ]
      }
    ]
  }
export default sheetsData
