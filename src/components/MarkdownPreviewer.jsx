import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import editorStyle from "./editor.module.css";
import previewStyle from "./preview.module.css";
import { FaExpandArrowsAlt } from "react-icons/fa";
import { FaCompressAlt } from "react-icons/fa";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js';

const marked = new Marked(
	markedHighlight({
		emptyLangClass: 'hljs',
		langPrefix: 'hljs language-',
		highlight(code, lang) {
			const language = hljs.getLanguage(lang) ? lang : 'plaintext';
			return hljs.highlight(code, { language }).value;
		}
	})
)

marked.setOptions({
	breaks: true,
	gfm: true,
});

const Editor = ({ id, title, value, onChange, onClick, isExpanded, isHidden }) => {
	return (
		<div className={`${styles.childContainer} ${isHidden? styles.hidden : ""}`}>
			<div className={styles.header}>
				<p>
					{title}
				</p>
				{isExpanded ? 
					<FaCompressAlt className={styles.expandButton} id="editor-expand-btn" onClick={() => onClick(id)}/>
					:
					<FaExpandArrowsAlt className={styles.expandButton} id="editor-expand-btn" onClick={() => onClick(id)}/>
				}
			</div>
			<textarea className={`${editorStyle.editor} ${isExpanded? styles.expanded : ""}`} type="text" id={id} rows={10} value={value} onChange={onChange} />
		</div>
	)
}

const Preview = ({ id, title, value, onClick, isExpanded, isHidden }) => {
	return (
		<div className={`${styles.childContainer} ${isHidden? styles.hidden : ""}`}>
			<div className={styles.header}>
				<p>
					{title}
				</p>
				{isExpanded ? 
					<FaCompressAlt className={styles.expandButton} id="preview-expand-btn" onClick={() => onClick(id)} />
					:
					<FaExpandArrowsAlt className={styles.expandButton} id="preview-expand-btn" onClick={() => onClick(id)} />
				}
			</div>
			<div id={id} className={`${previewStyle.preview} ${isExpanded? styles.expanded : ""}`} dangerouslySetInnerHTML={{ __html: value }}> 
			</div>
		</div>
	)
}

const MarkdownPreviewer = () => {
	const [input, setInput] = useState("");
	const [result, setResult] = useState("");
	const [expandedId, setExpandedId] = useState("");

	const handleChange = (event) => {
		const { value } = event.target;
		setInput(value);
	}

	const handleClick = (id) => {
		setExpandedId(id === expandedId? "" : id);
	}

	useEffect(() => {
		fetch('/initialMarkdown.md')
		.then((response) => response.text())
		.then((data) => setInput(data))
		.catch(() => console.log("Failed to fetch initial markdown"))
	}, [])

	useEffect(() => {
		const html = marked.parse(input);
		setResult(html);
	}, [input])

	return (
		<div className={styles.container}>
			<Editor id={"editor"} title={"Editor"} value={input} onChange={handleChange} onClick={handleClick} isExpanded={expandedId === 'editor'} isHidden={expandedId === 'preview'}/>
			<Preview id={"preview"} title={"Preview"} value={result} onClick={handleClick} isExpanded={expandedId === 'preview'} isHidden={expandedId === 'editor'}/>
		</div>
	)
}

export default MarkdownPreviewer