"""
Seeds the database with sample problems, a default admin account, and a
demo contest so every feature (auth, problems, bookmarks, admin, contests,
leaderboard) has real data to test against out of the box.

Safe to re-run - it skips anything that already exists instead of
crashing on a duplicate key.

Usage:
    python seed.py
"""

from datetime import datetime, timedelta

from app.core.database import SessionLocal, Base, engine
from app.models.problem import Problem
from app.models.boilerplate import Boilerplate
from app.models.testcase import TestCase
from app.models.user import User
from app.models.contest import Contest
from app.models.contest_problem import ContestProblem

from app.core.security import hash_password

# Make sure tables exist even if this is run before the API has started once.
Base.metadata.create_all(bind=engine)

db = SessionLocal()


def seed_problem(problem_id, title, difficulty, statement, constraints,
                  examples, tags, boilerplates, testcases,
                  company_tags=None, hints=None, editorial=None):

    existing = db.query(Problem).filter(Problem.id == problem_id).first()
    if existing:
        print(f"Skipping '{problem_id}' - already seeded.")
        return

    db.add(Problem(
        id=problem_id,
        title=title,
        difficulty=difficulty,
        statement=statement,
        constraints=constraints,
        examples=examples,
        tags=tags,
        company_tags=company_tags,
        hints=hints,
        editorial=editorial,
    ))

    for language, starter_code in boilerplates.items():
        db.add(Boilerplate(
            problem_id=problem_id,
            language=language,
            starter_code=starter_code
        ))

    for tc in testcases:
        db.add(TestCase(
            problem_id=problem_id,
            input_data=tc["input"],
            expected_output=tc["expected_output"],
            is_hidden=tc["is_hidden"]
        ))

    db.commit()
    print(f"Seeded '{problem_id}' ✅")


def bp(cpp, python, java):
    return {"cpp": cpp, "python": python, "java": java}


# ---------------------------------------------------------------------
# 1. Two Sum
# ---------------------------------------------------------------------
seed_problem(
    problem_id="two-sum",
    title="Two Sum",
    difficulty="Easy",
    statement="Return indices of two numbers such that they add up to target.",
    constraints="2 <= nums.length <= 10^4",
    examples="nums=[2,7,11,15], target=9 => [0,1]",
    tags="Array,HashMap",
    company_tags="Google,Amazon,Adobe",
    hints="Try a hash map to remember numbers you've already seen and their index.",
    editorial=(
        "Walk through the array once. For each number, check if "
        "(target - number) already exists in a hash map of seen values. "
        "If it does, you've found your pair in O(n) time."
    ),
    boilerplates=bp(
        "class Solution{\npublic:\n    vector<int> twoSum(vector<int>& nums,int target){\n\n    }\n};\n",
        "class Solution:\n    def twoSum(self, nums, target):\n        pass\n",
        "class Solution{\n    public int[] twoSum(int[] nums,int target){\n\n    }\n}\n",
    ),
    testcases=[
        {"input": "[2,7,11,15],9", "expected_output": "[0,1]", "is_hidden": False},
        {"input": "[3,2,4],6", "expected_output": "[1,2]", "is_hidden": False},
        {"input": "[3,3],6", "expected_output": "[0,1]", "is_hidden": True},
    ],
)

# ---------------------------------------------------------------------
# 2. Valid Parentheses
# ---------------------------------------------------------------------
seed_problem(
    problem_id="valid-parentheses",
    title="Valid Parentheses",
    difficulty="Easy",
    statement="Given a string s containing just '(){}[]', determine if it is valid.",
    constraints="1 <= s.length <= 10^4",
    examples='s = "()[]{}" => true',
    tags="Stack,String",
    company_tags="Amazon,Microsoft,Facebook",
    hints="A stack is perfect here - push opening brackets, pop on matching closers.",
    editorial=(
        "Push every opening bracket onto a stack. On a closing bracket, "
        "check the top of the stack matches; if not, or the stack is "
        "empty, the string is invalid. Valid only if the stack is empty "
        "at the end."
    ),
    boilerplates=bp(
        "class Solution{\npublic:\n    bool isValid(string s){\n\n    }\n};\n",
        "class Solution:\n    def isValid(self, s):\n        pass\n",
        "class Solution{\n    public boolean isValid(String s){\n\n    }\n}\n",
    ),
    testcases=[
        {"input": "()[]{}", "expected_output": "true", "is_hidden": False},
        {"input": "(]", "expected_output": "false", "is_hidden": False},
        {"input": "([)]", "expected_output": "false", "is_hidden": True},
    ],
)

# ---------------------------------------------------------------------
# 3. Reverse Integer
# ---------------------------------------------------------------------
seed_problem(
    problem_id="reverse-integer",
    title="Reverse Integer",
    difficulty="Medium",
    statement="Given a signed 32-bit integer x, return x with its digits reversed.",
    constraints="-2^31 <= x <= 2^31 - 1",
    examples="x = 123 => 321",
    tags="Math",
    company_tags="Apple,Bloomberg",
    hints="Watch out for 32-bit overflow after reversing.",
    boilerplates=bp(
        "class Solution{\npublic:\n    int reverse(int x){\n\n    }\n};\n",
        "class Solution:\n    def reverse(self, x):\n        pass\n",
        "class Solution{\n    public int reverse(int x){\n\n    }\n}\n",
    ),
    testcases=[
        {"input": "123", "expected_output": "321", "is_hidden": False},
        {"input": "-123", "expected_output": "-321", "is_hidden": False},
        {"input": "120", "expected_output": "21", "is_hidden": True},
    ],
)

# ---------------------------------------------------------------------
# 4. Palindrome Number
# ---------------------------------------------------------------------
seed_problem(
    problem_id="palindrome-number",
    title="Palindrome Number",
    difficulty="Easy",
    statement="Given an integer x, return true if x is a palindrome, false otherwise.",
    constraints="-2^31 <= x <= 2^31 - 1",
    examples="x = 121 => true",
    tags="Math",
    boilerplates=bp(
        "class Solution{\npublic:\n    bool isPalindrome(int x){\n\n    }\n};\n",
        "class Solution:\n    def isPalindrome(self, x):\n        pass\n",
        "class Solution{\n    public boolean isPalindrome(int x){\n\n    }\n}\n",
    ),
    testcases=[
        {"input": "121", "expected_output": "true", "is_hidden": False},
        {"input": "-121", "expected_output": "false", "is_hidden": False},
        {"input": "10", "expected_output": "false", "is_hidden": True},
    ],
)

# ---------------------------------------------------------------------
# 5. Roman to Integer
# ---------------------------------------------------------------------
seed_problem(
    problem_id="roman-to-integer",
    title="Roman to Integer",
    difficulty="Easy",
    statement="Given a roman numeral, convert it to an integer.",
    constraints="1 <= s.length <= 15",
    examples='s = "III" => 3',
    tags="String,Math",
    boilerplates=bp(
        "class Solution{\npublic:\n    int romanToInt(string s){\n\n    }\n};\n",
        "class Solution:\n    def romanToInt(self, s):\n        pass\n",
        "class Solution{\n    public int romanToInt(String s){\n\n    }\n}\n",
    ),
    testcases=[
        {"input": "III", "expected_output": "3", "is_hidden": False},
        {"input": "LVIII", "expected_output": "58", "is_hidden": False},
        {"input": "MCMXCIV", "expected_output": "1994", "is_hidden": True},
    ],
)

# ---------------------------------------------------------------------
# 6. Longest Common Prefix
# ---------------------------------------------------------------------
seed_problem(
    problem_id="longest-common-prefix",
    title="Longest Common Prefix",
    difficulty="Easy",
    statement="Find the longest common prefix string amongst an array of strings.",
    constraints="1 <= strs.length <= 200",
    examples='strs=["flower","flow","flight"] => "fl"',
    tags="String",
    boilerplates=bp(
        "class Solution{\npublic:\n    string longestCommonPrefix(vector<string>& strs){\n\n    }\n};\n",
        "class Solution:\n    def longestCommonPrefix(self, strs):\n        pass\n",
        "class Solution{\n    public String longestCommonPrefix(String[] strs){\n\n    }\n}\n",
    ),
    testcases=[
        {"input": '["flower","flow","flight"]', "expected_output": "fl", "is_hidden": False},
        {"input": '["dog","racecar","car"]', "expected_output": "", "is_hidden": False},
        {"input": '["interspecies","interstellar","interstate"]', "expected_output": "inters", "is_hidden": True},
    ],
)

# ---------------------------------------------------------------------
# 7. Remove Duplicates from Sorted Array
# ---------------------------------------------------------------------
seed_problem(
    problem_id="remove-duplicates-sorted-array",
    title="Remove Duplicates from Sorted Array",
    difficulty="Easy",
    statement="Remove duplicates in-place from sorted array nums, return new length k.",
    constraints="1 <= nums.length <= 3*10^4",
    examples="nums=[1,1,2] => 2, nums=[1,1,2]",
    tags="Array,TwoPointers",
    boilerplates=bp(
        "class Solution{\npublic:\n    int removeDuplicates(vector<int>& nums){\n\n    }\n};\n",
        "class Solution:\n    def removeDuplicates(self, nums):\n        pass\n",
        "class Solution{\n    public int removeDuplicates(int[] nums){\n\n    }\n}\n",
    ),
    testcases=[
        {"input": "[1,1,2]", "expected_output": "2", "is_hidden": False},
        {"input": "[0,0,1,1,1,2,2,3,3,4]", "expected_output": "5", "is_hidden": False},
        {"input": "[1,2,3]", "expected_output": "3", "is_hidden": True},
    ],
)

# ---------------------------------------------------------------------
# 8. Search Insert Position
# ---------------------------------------------------------------------
seed_problem(
    problem_id="search-insert-position",
    title="Search Insert Position",
    difficulty="Easy",
    statement="Given sorted array nums and target, return index if found, else where it would be inserted.",
    constraints="1 <= nums.length <= 10^4",
    examples="nums=[1,3,5,6], target=5 => 2",
    tags="Array,BinarySearch",
    boilerplates=bp(
        "class Solution{\npublic:\n    int searchInsert(vector<int>& nums,int target){\n\n    }\n};\n",
        "class Solution:\n    def searchInsert(self, nums, target):\n        pass\n",
        "class Solution{\n    public int searchInsert(int[] nums,int target){\n\n    }\n}\n",
    ),
    testcases=[
        {"input": "[1,3,5,6],5", "expected_output": "2", "is_hidden": False},
        {"input": "[1,3,5,6],2", "expected_output": "1", "is_hidden": False},
        {"input": "[1,3,5,6],7", "expected_output": "4", "is_hidden": True},
    ],
)

# ---------------------------------------------------------------------
# 9. Maximum Subarray
# ---------------------------------------------------------------------
seed_problem(
    problem_id="maximum-subarray",
    title="Maximum Subarray",
    difficulty="Medium",
    statement="Find the contiguous subarray with the largest sum, return its sum.",
    constraints="1 <= nums.length <= 10^5",
    examples="nums=[-2,1,-3,4,-1,2,1,-5,4] => 6",
    tags="Array,DP",
    company_tags="Microsoft,LinkedIn",
    hints="Kadane's algorithm: track the best sum ending at each index.",
    boilerplates=bp(
        "class Solution{\npublic:\n    int maxSubArray(vector<int>& nums){\n\n    }\n};\n",
        "class Solution:\n    def maxSubArray(self, nums):\n        pass\n",
        "class Solution{\n    public int maxSubArray(int[] nums){\n\n    }\n}\n",
    ),
    testcases=[
        {"input": "[-2,1,-3,4,-1,2,1,-5,4]", "expected_output": "6", "is_hidden": False},
        {"input": "[1]", "expected_output": "1", "is_hidden": False},
        {"input": "[5,4,-1,7,8]", "expected_output": "23", "is_hidden": True},
    ],
)

# ---------------------------------------------------------------------
# 10. Plus One
# ---------------------------------------------------------------------
seed_problem(
    problem_id="plus-one",
    title="Plus One",
    difficulty="Easy",
    statement="Given digits array representing a large integer, return digits after adding one.",
    constraints="1 <= digits.length <= 100",
    examples="digits=[1,2,3] => [1,2,4]",
    tags="Array,Math",
    boilerplates=bp(
        "class Solution{\npublic:\n    vector<int> plusOne(vector<int>& digits){\n\n    }\n};\n",
        "class Solution:\n    def plusOne(self, digits):\n        pass\n",
        "class Solution{\n    public int[] plusOne(int[] digits){\n\n    }\n}\n",
    ),
    testcases=[
        {"input": "[1,2,3]", "expected_output": "[1,2,4]", "is_hidden": False},
        {"input": "[4,3,2,1]", "expected_output": "[4,3,2,2]", "is_hidden": False},
        {"input": "[9,9]", "expected_output": "[1,0,0]", "is_hidden": True},
    ],
)

# ---------------------------------------------------------------------
# 11. Climbing Stairs
# ---------------------------------------------------------------------
seed_problem(
    problem_id="climbing-stairs",
    title="Climbing Stairs",
    difficulty="Easy",
    statement="You can climb 1 or 2 steps at a time. Return distinct ways to climb n stairs.",
    constraints="1 <= n <= 45",
    examples="n = 3 => 3",
    tags="DP,Math",
    company_tags="Adobe,Apple",
    hints="This is the Fibonacci sequence in disguise.",
    boilerplates=bp(
        "class Solution{\npublic:\n    int climbStairs(int n){\n\n    }\n};\n",
        "class Solution:\n    def climbStairs(self, n):\n        pass\n",
        "class Solution{\n    public int climbStairs(int n){\n\n    }\n}\n",
    ),
    testcases=[
        {"input": "2", "expected_output": "2", "is_hidden": False},
        {"input": "3", "expected_output": "3", "is_hidden": False},
        {"input": "5", "expected_output": "8", "is_hidden": True},
    ],
)

# ---------------------------------------------------------------------
# 12. Merge Sorted Array
# ---------------------------------------------------------------------
seed_problem(
    problem_id="merge-sorted-array",
    title="Merge Sorted Array",
    difficulty="Easy",
    statement="Merge nums2 into nums1 as one sorted array, in-place.",
    constraints="nums1.length == m + n",
    examples="nums1=[1,2,3,0,0,0],m=3,nums2=[2,5,6],n=3 => [1,2,2,3,5,6]",
    tags="Array,TwoPointers",
    boilerplates=bp(
        "class Solution{\npublic:\n    void merge(vector<int>& nums1,int m,vector<int>& nums2,int n){\n\n    }\n};\n",
        "class Solution:\n    def merge(self, nums1, m, nums2, n):\n        pass\n",
        "class Solution{\n    public void merge(int[] nums1,int m,int[] nums2,int n){\n\n    }\n}\n",
    ),
    testcases=[
        {"input": "[1,2,3,0,0,0],3,[2,5,6],3", "expected_output": "[1,2,2,3,5,6]", "is_hidden": False},
        {"input": "[1],1,[],0", "expected_output": "[1]", "is_hidden": False},
        {"input": "[0],0,[1],1", "expected_output": "[1]", "is_hidden": True},
    ],
)

# ---------------------------------------------------------------------
# 13. Binary Search
# ---------------------------------------------------------------------
seed_problem(
    problem_id="binary-search",
    title="Binary Search",
    difficulty="Easy",
    statement="Given a sorted array nums and target, return index of target or -1.",
    constraints="1 <= nums.length <= 10^4",
    examples="nums=[-1,0,3,5,9,12], target=9 => 4",
    tags="Array,BinarySearch",
    boilerplates=bp(
        "class Solution{\npublic:\n    int search(vector<int>& nums,int target){\n\n    }\n};\n",
        "class Solution:\n    def search(self, nums, target):\n        pass\n",
        "class Solution{\n    public int search(int[] nums,int target){\n\n    }\n}\n",
    ),
    testcases=[
        {"input": "[-1,0,3,5,9,12],9", "expected_output": "4", "is_hidden": False},
        {"input": "[-1,0,3,5,9,12],2", "expected_output": "-1", "is_hidden": False},
        {"input": "[5],5", "expected_output": "0", "is_hidden": True},
    ],
)

# ---------------------------------------------------------------------
# 14. Best Time to Buy and Sell Stock
# ---------------------------------------------------------------------
seed_problem(
    problem_id="best-time-to-buy-sell-stock",
    title="Best Time to Buy and Sell Stock",
    difficulty="Easy",
    statement="Return the max profit from one buy and one sell of a stock given prices array.",
    constraints="1 <= prices.length <= 10^5",
    examples="prices=[7,1,5,3,6,4] => 5",
    tags="Array,DP",
    company_tags="Amazon,Bloomberg",
    hints="Track the minimum price seen so far while scanning left to right.",
    boilerplates=bp(
        "class Solution{\npublic:\n    int maxProfit(vector<int>& prices){\n\n    }\n};\n",
        "class Solution:\n    def maxProfit(self, prices):\n        pass\n",
        "class Solution{\n    public int maxProfit(int[] prices){\n\n    }\n}\n",
    ),
    testcases=[
        {"input": "[7,1,5,3,6,4]", "expected_output": "5", "is_hidden": False},
        {"input": "[7,6,4,3,1]", "expected_output": "0", "is_hidden": False},
        {"input": "[2,4,1]", "expected_output": "2", "is_hidden": True},
    ],
)

# ---------------------------------------------------------------------
# 15. Single Number
# ---------------------------------------------------------------------
seed_problem(
    problem_id="single-number",
    title="Single Number",
    difficulty="Easy",
    statement="Every element appears twice except one, find that single one.",
    constraints="1 <= nums.length <= 3*10^4",
    examples="nums=[4,1,2,1,2] => 4",
    tags="Array,Bit Manipulation",
    boilerplates=bp(
        "class Solution{\npublic:\n    int singleNumber(vector<int>& nums){\n\n    }\n};\n",
        "class Solution:\n    def singleNumber(self, nums):\n        pass\n",
        "class Solution{\n    public int singleNumber(int[] nums){\n\n    }\n}\n",
    ),
    testcases=[
        {"input": "[2,2,1]", "expected_output": "1", "is_hidden": False},
        {"input": "[4,1,2,1,2]", "expected_output": "4", "is_hidden": False},
        {"input": "[1]", "expected_output": "1", "is_hidden": True},
    ],
)

# ---------------------------------------------------------------------
# 16. Majority Element
# ---------------------------------------------------------------------
seed_problem(
    problem_id="majority-element",
    title="Majority Element",
    difficulty="Easy",
    statement="Return the element that appears more than n/2 times.",
    constraints="1 <= nums.length <= 5*10^4",
    examples="nums=[2,2,1,1,1,2,2] => 2",
    tags="Array,HashMap",
    boilerplates=bp(
        "class Solution{\npublic:\n    int majorityElement(vector<int>& nums){\n\n    }\n};\n",
        "class Solution:\n    def majorityElement(self, nums):\n        pass\n",
        "class Solution{\n    public int majorityElement(int[] nums){\n\n    }\n}\n",
    ),
    testcases=[
        {"input": "[3,2,3]", "expected_output": "3", "is_hidden": False},
        {"input": "[2,2,1,1,1,2,2]", "expected_output": "2", "is_hidden": False},
        {"input": "[1]", "expected_output": "1", "is_hidden": True},
    ],
)

# ---------------------------------------------------------------------
# 17. Contains Duplicate
# ---------------------------------------------------------------------
seed_problem(
    problem_id="contains-duplicate",
    title="Contains Duplicate",
    difficulty="Easy",
    statement="Return true if any value appears at least twice in the array.",
    constraints="1 <= nums.length <= 10^5",
    examples="nums=[1,2,3,1] => true",
    tags="Array,HashSet",
    boilerplates=bp(
        "class Solution{\npublic:\n    bool containsDuplicate(vector<int>& nums){\n\n    }\n};\n",
        "class Solution:\n    def containsDuplicate(self, nums):\n        pass\n",
        "class Solution{\n    public boolean containsDuplicate(int[] nums){\n\n    }\n}\n",
    ),
    testcases=[
        {"input": "[1,2,3,1]", "expected_output": "true", "is_hidden": False},
        {"input": "[1,2,3,4]", "expected_output": "false", "is_hidden": False},
        {"input": "[1,1,1,3,3,4,3,2,4,2]", "expected_output": "true", "is_hidden": True},
    ],
)

# ---------------------------------------------------------------------
# 18. Move Zeroes
# ---------------------------------------------------------------------
seed_problem(
    problem_id="move-zeroes",
    title="Move Zeroes",
    difficulty="Easy",
    statement="Move all zeroes to the end of the array while keeping relative order.",
    constraints="1 <= nums.length <= 10^4",
    examples="nums=[0,1,0,3,12] => [1,3,12,0,0]",
    tags="Array,TwoPointers",
    boilerplates=bp(
        "class Solution{\npublic:\n    void moveZeroes(vector<int>& nums){\n\n    }\n};\n",
        "class Solution:\n    def moveZeroes(self, nums):\n        pass\n",
        "class Solution{\n    public void moveZeroes(int[] nums){\n\n    }\n}\n",
    ),
    testcases=[
        {"input": "[0,1,0,3,12]", "expected_output": "[1,3,12,0,0]", "is_hidden": False},
        {"input": "[0]", "expected_output": "[0]", "is_hidden": False},
        {"input": "[1,0,1]", "expected_output": "[1,1,0]", "is_hidden": True},
    ],
)

# ---------------------------------------------------------------------
# 19. Fibonacci Number
# ---------------------------------------------------------------------
seed_problem(
    problem_id="fibonacci-number",
    title="Fibonacci Number",
    difficulty="Easy",
    statement="Return the n-th Fibonacci number.",
    constraints="0 <= n <= 30",
    examples="n = 4 => 3",
    tags="Math,DP",
    boilerplates=bp(
        "class Solution{\npublic:\n    int fib(int n){\n\n    }\n};\n",
        "class Solution:\n    def fib(self, n):\n        pass\n",
        "class Solution{\n    public int fib(int n){\n\n    }\n}\n",
    ),
    testcases=[
        {"input": "2", "expected_output": "1", "is_hidden": False},
        {"input": "4", "expected_output": "3", "is_hidden": False},
        {"input": "10", "expected_output": "55", "is_hidden": True},
    ],
)

# ---------------------------------------------------------------------
# 20. Fizz Buzz
# ---------------------------------------------------------------------
seed_problem(
    problem_id="fizz-buzz",
    title="Fizz Buzz",
    difficulty="Easy",
    statement='Return string array 1..n: "FizzBuzz" for multiples of 15, "Fizz" of 3, "Buzz" of 5, else number.',
    constraints="1 <= n <= 10^4",
    examples='n = 5 => ["1","2","Fizz","4","Buzz"]',
    tags="Math,String",
    boilerplates=bp(
        "class Solution{\npublic:\n    vector<string> fizzBuzz(int n){\n\n    }\n};\n",
        "class Solution:\n    def fizzBuzz(self, n):\n        pass\n",
        "class Solution{\n    public List<String> fizzBuzz(int n){\n\n    }\n}\n",
    ),
    testcases=[
        {"input": "3", "expected_output": '["1","2","Fizz"]', "is_hidden": False},
        {"input": "5", "expected_output": '["1","2","Fizz","4","Buzz"]', "is_hidden": False},
        {"input": "15", "expected_output": '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]', "is_hidden": True},
    ],
)

# ---------------------------------------------------------------------
# 21. Add Binary
# ---------------------------------------------------------------------
seed_problem(
    problem_id="add-binary",
    title="Add Binary",
    difficulty="Easy",
    statement="Given two binary strings a and b, return their sum as a binary string.",
    constraints="1 <= a.length, b.length <= 10^4",
    examples='a="11", b="1" => "100"',
    tags="String,Math",
    boilerplates=bp(
        "class Solution{\npublic:\n    string addBinary(string a,string b){\n\n    }\n};\n",
        "class Solution:\n    def addBinary(self, a, b):\n        pass\n",
        "class Solution{\n    public String addBinary(String a,String b){\n\n    }\n}\n",
    ),
    testcases=[
        {"input": "11,1", "expected_output": "100", "is_hidden": False},
        {"input": "1010,1011", "expected_output": "10101", "is_hidden": False},
        {"input": "0,0", "expected_output": "0", "is_hidden": True},
    ],
)

# ---------------------------------------------------------------------
# 22. Length of Last Word
# ---------------------------------------------------------------------
seed_problem(
    problem_id="length-of-last-word",
    title="Length of Last Word",
    difficulty="Easy",
    statement="Given a string s, return the length of the last word in it.",
    constraints="1 <= s.length <= 10^4",
    examples='s = "Hello World" => 5',
    tags="String",
    boilerplates=bp(
        "class Solution{\npublic:\n    int lengthOfLastWord(string s){\n\n    }\n};\n",
        "class Solution:\n    def lengthOfLastWord(self, s):\n        pass\n",
        "class Solution{\n    public int lengthOfLastWord(String s){\n\n    }\n}\n",
    ),
    testcases=[
        {"input": "Hello World", "expected_output": "5", "is_hidden": False},
        {"input": "   fly me   to   the moon  ", "expected_output": "4", "is_hidden": False},
        {"input": "luffy is still joyboy", "expected_output": "6", "is_hidden": True},
    ],
)

# ---------------------------------------------------------------------
# 23. Reverse String
# ---------------------------------------------------------------------
seed_problem(
    problem_id="reverse-string",
    title="Reverse String",
    difficulty="Easy",
    statement="Reverse the given character array in-place.",
    constraints="1 <= s.length <= 10^5",
    examples='s=["h","e","l","l","o"] => ["o","l","l","e","h"]',
    tags="String,TwoPointers",
    boilerplates=bp(
        "class Solution{\npublic:\n    void reverseString(vector<char>& s){\n\n    }\n};\n",
        "class Solution:\n    def reverseString(self, s):\n        pass\n",
        "class Solution{\n    public void reverseString(char[] s){\n\n    }\n}\n",
    ),
    testcases=[
        {"input": '["h","e","l","l","o"]', "expected_output": '["o","l","l","e","h"]', "is_hidden": False},
        {"input": '["H","a","n","n","a","h"]', "expected_output": '["h","a","n","n","a","H"]', "is_hidden": False},
        {"input": '["a"]', "expected_output": '["a"]', "is_hidden": True},
    ],
)

# ---------------------------------------------------------------------
# 24. First Unique Character in a String
# ---------------------------------------------------------------------
seed_problem(
    problem_id="first-unique-character",
    title="First Unique Character in a String",
    difficulty="Easy",
    statement="Return the index of the first non-repeating character, or -1.",
    constraints="1 <= s.length <= 10^5",
    examples='s = "leetcode" => 0',
    tags="String,HashMap",
    boilerplates=bp(
        "class Solution{\npublic:\n    int firstUniqChar(string s){\n\n    }\n};\n",
        "class Solution:\n    def firstUniqChar(self, s):\n        pass\n",
        "class Solution{\n    public int firstUniqChar(String s){\n\n    }\n}\n",
    ),
    testcases=[
        {"input": "leetcode", "expected_output": "0", "is_hidden": False},
        {"input": "loveleetcode", "expected_output": "2", "is_hidden": False},
        {"input": "aabb", "expected_output": "-1", "is_hidden": True},
    ],
)

# ---------------------------------------------------------------------
# 25. Valid Anagram
# ---------------------------------------------------------------------
seed_problem(
    problem_id="valid-anagram",
    title="Valid Anagram",
    difficulty="Easy",
    statement="Return true if t is an anagram of s.",
    constraints="1 <= s.length <= 5*10^4",
    examples='s="anagram", t="nagaram" => true',
    tags="String,HashMap",
    boilerplates=bp(
        "class Solution{\npublic:\n    bool isAnagram(string s,string t){\n\n    }\n};\n",
        "class Solution:\n    def isAnagram(self, s, t):\n        pass\n",
        "class Solution{\n    public boolean isAnagram(String s,String t){\n\n    }\n}\n",
    ),
    testcases=[
        {"input": "anagram,nagaram", "expected_output": "true", "is_hidden": False},
        {"input": "rat,car", "expected_output": "false", "is_hidden": False},
        {"input": "a,ab", "expected_output": "false", "is_hidden": True},
    ],
)

# ---------------------------------------------------------------------
# 26. Ransom Note
# ---------------------------------------------------------------------
seed_problem(
    problem_id="ransom-note",
    title="Ransom Note",
    difficulty="Easy",
    statement="Return true if ransomNote can be constructed from letters in magazine.",
    constraints="1 <= ransomNote.length, magazine.length <= 10^5",
    examples='ransomNote="a", magazine="b" => false',
    tags="String,HashMap",
    boilerplates=bp(
        "class Solution{\npublic:\n    bool canConstruct(string ransomNote,string magazine){\n\n    }\n};\n",
        "class Solution:\n    def canConstruct(self, ransomNote, magazine):\n        pass\n",
        "class Solution{\n    public boolean canConstruct(String ransomNote,String magazine){\n\n    }\n}\n",
    ),
    testcases=[
        {"input": "a,b", "expected_output": "false", "is_hidden": False},
        {"input": "aa,ab", "expected_output": "false", "is_hidden": False},
        {"input": "aa,aab", "expected_output": "true", "is_hidden": True},
    ],
)

# ---------------------------------------------------------------------
# 27. Missing Number
# ---------------------------------------------------------------------
seed_problem(
    problem_id="missing-number",
    title="Missing Number",
    difficulty="Easy",
    statement="Given array nums of n distinct numbers in range [0,n], return the missing one.",
    constraints="1 <= n <= 10^4",
    examples="nums=[3,0,1] => 2",
    tags="Array,Math,BitManipulation",
    boilerplates=bp(
        "class Solution{\npublic:\n    int missingNumber(vector<int>& nums){\n\n    }\n};\n",
        "class Solution:\n    def missingNumber(self, nums):\n        pass\n",
        "class Solution{\n    public int missingNumber(int[] nums){\n\n    }\n}\n",
    ),
    testcases=[
        {"input": "[3,0,1]", "expected_output": "2", "is_hidden": False},
        {"input": "[0,1]", "expected_output": "2", "is_hidden": False},
        {"input": "[9,6,4,2,3,5,7,0,1]", "expected_output": "8", "is_hidden": True},
    ],
)

# =======================================================================
# Default admin account (for testing /admin/* endpoints)
# =======================================================================
admin_email = "admin@example.com"
existing_admin = db.query(User).filter(User.email == admin_email).first()

if existing_admin:
    print("Skipping admin user - already exists.")
else:
    db.add(User(
        username="admin",
        email=admin_email,
        password_hash=hash_password("admin123"),
        is_admin=True,
        is_verified=True,
    ))
    db.commit()
    print("Seeded admin user ✅  (email: admin@example.com / password: admin123)")

# =======================================================================
# Demo contest (for testing /contests/* endpoints)
# =======================================================================
existing_contest = db.query(Contest).filter(Contest.title == "Weekly Demo Contest").first()

if existing_contest:
    print("Skipping demo contest - already exists.")
else:
    contest = Contest(
        title="Weekly Demo Contest",
        description="A sample contest to test the contest + leaderboard APIs.",
        start_time=datetime.utcnow() - timedelta(hours=1),
        end_time=datetime.utcnow() + timedelta(days=7),
    )
    db.add(contest)
    db.commit()
    db.refresh(contest)

    for index, pid in enumerate(["two-sum", "valid-parentheses", "climbing-stairs"], start=1):
        db.add(ContestProblem(contest_id=contest.id, problem_id=pid, order_index=index))
    db.commit()

    print(f"Seeded demo contest ✅  (id: {contest.id}, ongoing for the next 7 days)")

db.close()
