class Solution:
    def isPalindrome(self, x: int) -> bool:
         if int(str(x)[::-1]) == x:
            return True 
         else:
            return False

print(Solution().isPalindrome(121))
print(Solution().isPalindrome(-121))
