import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import editorStyle from "./editor.module.css";
import previewStyle from "./preview.module.css";
import { FaExpandArrowsAlt } from "react-icons/fa";
import { FaCompressAlt } from "react-icons/fa";
import { FaEraser } from "react-icons/fa";
import { MdOutlinePreview } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";
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

const Editor = ({ id, title, value, onChange, onClick, onClickEraser, isExpanded, isHidden }) => {
	return (
		<div className={`${styles.childContainer} ${isHidden? styles.hidden : ""}`}>
			<div className={styles.header}>
					<div className={styles.titleIconContainer}>
					<MdOutlineEdit className={styles.headerIcon}/>
					<p>
						{title}
					</p>
				</div>
				<div className={editorStyle.buttonsContainer}>
					<FaEraser className={styles.buttons} onClick={() => onClickEraser()}/>
					{isExpanded ? 
						<FaCompressAlt className={styles.buttons} onClick={() => onClick(id)}/>
						:
						<FaExpandArrowsAlt className={styles.buttons} onClick={() => onClick(id)}/>
					}
				</div>
			</div>
			<textarea className={`${editorStyle.editor} ${isExpanded? styles.expanded : ""}`} type="text" id={id} rows={10} value={value} onChange={onChange} />
		</div>
	)
}

const Preview = ({ id, title, value, onClick, isExpanded, isHidden }) => {
	return (
		<div className={`${styles.childContainer} ${isHidden? styles.hidden : ""}`}>
			<div className={styles.header}>
				<div className={styles.titleIconContainer}>
					<MdOutlinePreview className={styles.headerIcon}/>
					<p>
						{title}
					</p>
				</div>
				{isExpanded ? 
					<FaCompressAlt className={styles.buttons} onClick={() => onClick(id)} />
					:
					<FaExpandArrowsAlt className={styles.buttons} onClick={() => onClick(id)} />
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

	const clearInput = () => {
		setInput("");
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
			<Editor id={"editor"} title={"Editor"} value={input} onChange={handleChange} onClick={handleClick} onClickEraser={clearInput} isExpanded={expandedId === 'editor'} isHidden={expandedId === 'preview'}/>
			<Preview id={"preview"} title={"Preview"} value={result} onClick={handleClick} isExpanded={expandedId === 'preview'} isHidden={expandedId === 'editor'}/>
		</div>
	)
}

export default MarkdownPreviewer