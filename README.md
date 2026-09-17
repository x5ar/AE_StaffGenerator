# Staff Generator

After Effectsで五線譜と音符を生成するScriptUIパネルです。生成結果は通常のShape Layerなので、生成後もAfter Effects上で編集できます。

## インストール

1. `StaffGenerator.jsx` をAfter Effectsの `Scripts/ScriptUI Panels` フォルダへ入れます。
2. After Effectsを再起動します。
3. `Window > Staff Generator` を開きます。
4. 五線譜を置きたいコンポジションをアクティブにします。
5. `Generate` を押します。

生成すると、現在のコンポジションへShape Layerが1つ追加されます。

## 基本的な使い方

通常は `Basic` タブだけで使用できます。

- `Preset`: あらかじめ用意された生成傾向を適用します。長さ・サイズ・位置などのレイアウト値は変更しません。
- `Length (px)`: 五線譜の横幅です。
- `Staff Space (px)`: 五線の間隔と譜面全体の基準サイズです。
- `Measures`: 小節数です。
- `Pitch Range`: 生成する音域です。
- `Rhythm Density %`: 高いほど短い音価を含む密度の高いリズムを生成しやすくなります。現在の横幅に収まらない場合は内部で安全な密度まで自動調整されます。
- `Rest Amount %`: 休符になるイベントの割合です。
- `Allow generated accidentals`: シャープ、フラット等の臨時記号を許可します。
- `Global Line Weight %`: 五線、符幹、連桁、小節線、加線の太さをまとめて調整します。

### Advanced

`Advanced` タブでは細かい調整ができます。

- `Master Seed`: 同じ設定とSeedを使うと同じ結果を再現できます。
- `Melody Motion %`: 0に近いほど滑らかな順次進行、100に近いほど広い跳躍を増やします。
- `Repetition %`: 同じ音を繰り返す傾向です。
- `Auto-beam generated / MIDI`: 8分音符・16分音符の連桁を有効化します。
- `Position X (px)` / `Position Y (px)`: 生成Shape Layerの初期位置です。
- `Overall Scale %`: 生成Shape Layer全体の初期倍率です。
- `Note Scale %` / `Symbol Scale %`: 音符とその他の楽譜記号のサイズを個別調整します。
- `Line Thickness`: `Staff Line`、`Stem`、`Beam`、`Barline`、`Ledger Line`の基準太さを個別調整します。

通常は個別の `Line Thickness` を変更せず、Basicの `Global Line Weight %` のみを使用することを推奨します。

## ボタン

- `Generate`: 現在の設定から五線譜を生成します。
- `Randomize`: `Length (px)`、`Staff Space (px)`、`Measures`、`Position X (px)`、`Position Y (px)`、`Overall Scale %`、`Note Scale %`、`Symbol Scale %`、`Global Line Weight %`などのレイアウト・見た目を維持したまま、`Master Seed`、`Pitch Range`、`Rhythm Density %`、`Rest Amount %`、`Melody Motion %`、`Repetition %`、`Auto-beam generated / MIDI`、`Allow generated accidentals`をランダム化します。押しただけではShape Layerは生成されません。
- `Auto Adjust`: 現在の譜面が収まるように必要な`Length (px)`を増やします。最大`Length (px)`を超える場合のみ`Staff Space (px)`、`Note Scale %`、`Symbol Scale %`を縮小します。`Measures`は自動変更しません。
- `Reset`: 初期設定へ戻します。

## Preset

Built-in Preset:

- Default
- Simple
- Balanced
- Dense
- Calm
- Dynamic
- Chaotic

Presetは生成傾向だけを変更します。`Length (px)`、`Staff Space (px)`、`Measures`、`Pitch Range`、`Position X (px)`、`Position Y (px)`、`Overall Scale %`、`Note Scale %`、`Symbol Scale %`、`Global Line Weight %`などは保持されます。

現在の横幅に対してPresetのリズムが密すぎる場合、生成時にリズム密度だけを内部的に下げて、可能な限り現在のLengthへ収めます。この調整は同じSeedと設定に対して決定的に行われるため、結果の再現性は維持されます。

Preset対象の生成項目を手動変更すると `Custom` になります。Pitch RangeなどPresetが管理しない項目を変更してもPreset名は維持されます。

## レイアウトエラー

極端に短い`Length (px)`、大きい`Staff Space (px)`、多すぎる`Measures`など、最も単純な譜面でも物理的に収まらない設定ではエラーになる場合があります。

その場合は以下を試してください。

- `Auto Adjust` を押す
- `Length (px)` を増やす
- `Measures` を減らす
- `Staff Space (px)` を小さくする
- Advancedの `Note Scale %` / `Symbol Scale %` を小さくする

音域を広くすると五線の外へ音符が出ますが、必要な加線が自動生成されるため正常です。

## MIDI / MusicXML Import

`Import` タブからMIDIまたはMusicXMLを読み込み、既存のEngraving / Shape Layerレンダラーで五線譜へ変換できます。

MIDI / MusicXMLから生成した五線譜は、元データの内容やImporterの対応状況によって、一般的な楽譜ソフトと完全に同一の記譜にならない場合があります。音高・リズム・休符・和音などの主要な音楽情報をもとにStaff Generator側で再構成するため、調号・音部記号・複数声部・タイ・連符など、一部の記譜情報が省略されたり、異なる表現になったりすることがあります。特にMIDIは演奏情報を中心とした形式のため、読みやすい楽譜として完全に復元できることを保証するものではありません。

- `Browse...`: OS標準のファイル選択ダイアログを開きます。Windows / macOSの両方に対応します。
- ファイルパス欄は直接入力・貼り付けにも対応します。
- MIDIでは `Track / Channel`、MusicXMLでは `Part / Staff / Voice` をSourceとして分離し、選択した1つを生成します。
- `Import & Generate` で解析・検証後、現在のコンポジションへ編集可能なShape Layerとして生成します。
- MIDI: Standard MIDI File format 0 / 1、PPQN timingに対応し、480 TPQ / 1/16グリッドへ量子化します。
- MusicXML: 非圧縮の `.musicxml` / `.xml`、`score-partwise` / `score-timewise` に対応します。
- MusicXMLのページ・段組み・座標はコピーせず、音楽構造を読み取ってStaff Generator側で横長の五線譜として再レイアウトします。

現在のレンダラーに合わせ、ImportはTreble Clef / 選択した単一Voiceを対象とし、4/4だけでなく分母2・4・8・16、分子1〜32の数値拍子と小節境界での拍子変更に対応します。1点付点のHalf・Quarter・Eighth、同一Voice内の単純な同時発音Chord、拍子情報だけを持つ空小節にも対応します。MIDIの単音または単純Chordが小節線を跨ぐ場合は、小節内の正規音価へ分割し、MIDI由来のTieとして表示します。複雑なPolyphony、加算拍子、連符、Bass Clef、MusicXMLのTie / Slur、圧縮 `.mxl` などは、意味を変えて近似せず明示的にエラーにします。

## ライセンス

Staff GeneratorのオリジナルコードはMIT Licenseです。詳細は [LICENSE](LICENSE) を確認してください。

このプロジェクトにはBravura由来の変換済み楽譜Glyph Outlineデータが含まれています。この第三者由来データはMITではなくSIL Open Font License 1.1の対象です。固定した変換元、バージョン、著作権表示、OFL全文は [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) を確認してください。

配布用JSXにもBravura由来データのOFL通知を埋め込んでいます。
