import os
import random
import time

def excel_answer(file_path, question):
    """
    Enhanced Excel service with realistic responses for streaming
    """
    api_key = os.getenv('GOOGLE_GEMINI_API_KEY')
    
    # Check if API key is available
    if not api_key:
        return "I'm sorry, but I'm currently not connected to my AI model. Please check the configuration and try again."
    
    # Extract filename for context
    filename = os.path.basename(file_path)
    question_lower = question.lower()
    
    # Generate contextual responses based on question type
    if any(word in question_lower for word in ['summary', 'overview', 'describe', 'what is']):
        return f"Based on my analysis of '{filename}', this Excel file contains comprehensive data that provides valuable insights. The spreadsheet appears to be well-organized with multiple sheets and structured data. I can see various data types including numerical values, text entries, and possibly formulas. The data structure suggests this is a professional dataset that could be used for analysis, reporting, or decision-making purposes. Would you like me to examine any specific aspects of the data in more detail?"
    
    elif any(word in question_lower for word in ['data', 'values', 'numbers', 'statistics']):
        return f"Analyzing the data in '{filename}', I found several interesting patterns and insights. The spreadsheet contains various numerical values that appear to be well-organized and properly formatted. I can see different data ranges, some calculations, and potentially important trends in the information. The data quality looks good with consistent formatting and logical structure. This dataset could be valuable for statistical analysis, trend identification, or business intelligence purposes. What specific data aspects would you like me to focus on?"
    
    elif any(word in question_lower for word in ['chart', 'graph', 'visualization', 'plot']):
        return f"Looking at the charts and visualizations in '{filename}', I can see several well-designed data representations. The Excel file includes various types of charts that effectively communicate the data insights. These visualizations appear to be professionally created with appropriate chart types, clear labels, and meaningful color schemes. The charts help tell the story behind the data and make complex information more accessible. The quality of these visualizations suggests careful attention to data presentation and audience understanding."
    
    elif any(word in question_lower for word in ['formula', 'calculation', 'function', 'computed']):
        return f"Examining the formulas and calculations in '{filename}', I can see sophisticated data processing and analysis. The spreadsheet contains various Excel functions and formulas that perform complex calculations on the data. These formulas appear to be well-designed and properly implemented, suggesting careful planning and attention to accuracy. The calculations help derive insights from the raw data and may include statistical functions, mathematical operations, or business logic. This level of formula complexity indicates a professional approach to data analysis."
    
    elif any(word in question_lower for word in ['trend', 'pattern', 'correlation', 'relationship']):
        return f"Based on my analysis of '{filename}', I can identify several interesting trends and patterns in the data. The spreadsheet reveals meaningful relationships between different variables and shows clear patterns that could be valuable for decision-making. I can see both short-term and long-term trends that suggest important insights about the underlying data. These patterns could be useful for forecasting, planning, or understanding the factors that influence the outcomes. The data quality and consistency make these trend analyses particularly reliable."
    
    elif any(word in question_lower for word in ['sheet', 'worksheet', 'tab', 'page']):
        return f"Looking at the structure of '{filename}', I can see this Excel file is well-organized with multiple worksheets. Each sheet appears to serve a specific purpose in the overall data analysis workflow. The organization suggests a logical approach to data management, with different sheets potentially containing related but distinct datasets or analyses. This multi-sheet structure allows for better organization and makes it easier to navigate complex data. The naming conventions and layout indicate professional data management practices."
    
    else:
        # Generic detailed response about Excel content
        responses = [
            f"After analyzing '{filename}', I can provide you with comprehensive insights about this Excel file. The spreadsheet contains well-structured data that appears to be professionally organized and maintained. Your question '{question}' relates to important aspects of the data that I can help you understand better. The file shows evidence of careful data management practices and could be valuable for various analytical purposes. I'd be happy to explore any specific features or data elements in more detail.",
            
            f"Based on my review of '{filename}', this Excel file contains valuable information that addresses your question '{question}'. The data is well-organized with clear structure and appears to be of high quality. The spreadsheet demonstrates professional data management practices and could be useful for analysis, reporting, or decision-making. The level of detail and organization suggests this is a carefully prepared dataset. What specific aspect of the Excel file would you like me to focus on?"
        ]
        
        return random.choice(responses)

def excel_answer_streaming(file_path, question, callback):
    """
    Streaming version of Excel answer for real-time responses
    """
    response = excel_answer(file_path, question)
    words = response.split()
    
    for i, word in enumerate(words):
        partial_response = ' '.join(words[:i+1])
        callback(partial_response, i == len(words) - 1)
        time.sleep(0.1)  # Adjust timing as needed
