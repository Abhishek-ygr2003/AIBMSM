import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const renderLine = (line: string, index: number) => {
    // Bold: **text**
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Unordered list item: * item or - item
    if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
      const itemContent = line.trim().substring(2);
      return (
        <li key={index} className="ml-4 list-disc" dangerouslySetInnerHTML={{ __html: itemContent }} />
      );
    }
    
    return <p key={index} dangerouslySetInnerHTML={{ __html: line }} />;
  };

  const lines = content.split('\n').filter(line => line.trim() !== '');
  
  // Group list items
  // FIX: Changed type from JSX.Element to React.ReactElement to resolve 'Cannot find namespace JSX' error.
  const elements: React.ReactElement[] = [];
  let inList = false;
  
  lines.forEach((line, index) => {
    const isListItem = line.trim().startsWith('* ') || line.trim().startsWith('- ');
    
    if (isListItem && !inList) {
      inList = true;
      elements.push(<ul key={`ul-start-${index}`} className="space-y-1 my-2">{renderLine(line, index)}</ul>);
    } else if (isListItem && inList) {
      // Add to the existing list
      const list = elements[elements.length - 1];
      const newChildren = [...React.Children.toArray(list.props.children), renderLine(line, index)];
      elements[elements.length - 1] = React.cloneElement(list, { children: newChildren });
    } else {
      inList = false;
      elements.push(renderLine(line, index));
    }
  });

  return <div className="space-y-2">{elements}</div>;
};

export default MarkdownRenderer;
